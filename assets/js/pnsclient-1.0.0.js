/**
 * PNS client (JavaScript) v.1.0.0
 * pnsUrl 메시지 구독 서버 URL
 * apiUrl 메시지 구독 API URL
 */
var PnsClient = function(pnsUrl, apiUrl, mbrSeq, applId, subscriptions) {
    this.pnsUrl = pnsUrl;
    this.apiUrl = apiUrl;
    this.mbrSeq = mbrSeq;
    this.applId = applId;
    this.uuid = this.applId + "." + this.mbrSeq;
    this.topic = this.pushTypeCd + "." + this.uuid;
    //
    this.sessions.mbrSeq = this.mbrSeq;
    this.sessions.cretrId = this.mbrSeq;
    this.sessions.amdrId = this.mbrSeq;
    this.sessions.applId = this.applId;
    this.sessions.applUuidVal = this.uuid;
    this.sessions.pushTypeCd = this.pushTypeCd;
    this.sessions.subscriptions = subscriptions;
};

PnsClient.prototype.pushTypeCd = '03';
PnsClient.prototype.pnsUrl;
PnsClient.prototype.apiUrl;
PnsClient.prototype.mbrSeq;
PnsClient.prototype.pnsUser;
PnsClient.prototype.pnsPass;
PnsClient.prototype.applId;
PnsClient.prototype.uuid;
PnsClient.prototype.topic;
PnsClient.prototype.accessToken;
PnsClient.prototype.sessions = {};

PnsClient.prototype.isConnect = false;
PnsClient.prototype.ws;
PnsClient.prototype.stomp;
PnsClient.prototype.connectCallback;
PnsClient.prototype.keepAlive = 10000;

PnsClient.prototype.xhr;

PnsClient.prototype.setUsername = function(username) {
	this.pnsUser = username;
};

PnsClient.prototype.setPassword = function(password) {
	this.pnsPass = password;
};

PnsClient.prototype.setAccessToken = function(accessToken) {
    this.accessToken = accessToken;
};

PnsClient.prototype.setKeepAlive = function(keepAlive) {
    this.keepAlive = keepAlive;
};

/****************************** 수정 ******************************/

PnsClient.prototype.connect = function(callback) {

	if (!this.isConnect) {
		console.log('request connect... (' + new Date() + ')');

		var client = this;

		this.connectCallback = callback;
		this.ws = new SockJS(this.pnsUrl);
		this.stomp = Stomp.over(this.ws);
		// Websocket open
		this.ws.onopen = function() {
			console.log('websocket opened... (' + new Date() + ')');
		};
		// Websocket message
		this.ws.onmessage = function(message) {
			console.log('message :' + message + ' (' + new Date() + ')');
		};
		// Websocket close
		this.ws.onclose = function(error) {
			console.log('websocket closed : ' + error + ' (' + new Date() + ')');
		};
		// Stomp connected
		var onconnect = function() {
	    	console.log('stomp connected... (' + new Date() + ')');
	    	return typeof client.connectCallback === "function" ? client.connectCallback() : void 0;
	    };
	    // Stomp error
	    var onerror = function(error) {
	    	console.log('stomp error : ' + error + ' (' + new Date() + ')');
	    	client.isConnect = false;
	    	setTimeout(function () {
	    		console.log('stomp retry connect... (' + new Date() + ')');
	    		client.connect(client.connectCallback);
	    	}, 10000);
	    };

		this.stomp.heartbeat.outgoing = this.keepAlive; // client will send heartbeats every keep alive time
		this.stomp.heartbeat.incoming = 0;     			// client does not want to receive heartbeats
		this.stomp.connect(this.pnsUser, this.pnsPass, onconnect, onerror, '/');

		this.isConnect = true;
	} else {
		console.log('stomp already connect... (' + new Date() + ')');
	}
};

PnsClient.prototype.disconnect = function(callback) {
	console.log('stomp disconnected... (' + new Date() + ')');
	this.isConnect = false;
	this.stomp.disconnect(callback);
};

PnsClient.prototype.subscribe = function(callback) {
	console.log('subscribe topic : ' + this.topic + ' (' + new Date() + ')');
	// Stomp subscribe
	this.stomp.subscribe('/topic/' + this.topic, callback);
	// API subscribe
    var apiUrl = this.apiUrl;
    this.xhr = createXMLHttpRequest();
    this.xhr.open("POST", apiUrl, true);
    this.xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    this.xhr.setRequestHeader('authorization', 'Bearer '+ this.accessToken);
    this.xhr.onreadystatechange = this.bind(this, this.handler);
    this.xhr.send(JSON.stringify(this.sessions));
};

function createXMLHttpRequest() {
	console.log('request subscribe to PNS API... (' + new Date() + ')');
    if(window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else if(window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        console.log('request fail... (' + new Date() + ')');
    }
};

PnsClient.prototype.bind = function(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
};

PnsClient.prototype.handler = function() {
    if(this.xhr.readyState === 4 && this.xhr.status === 200) {
    	console.log('request success... (' + new Date() + ')');
    } else if (this.xhr.readyState === 4 && this.xhr.status !== 200) {
    	console.log('request fail... (' + new Date() + ')');
    }
};
