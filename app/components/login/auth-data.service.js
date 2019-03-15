angular
    .module('app.auth')
    .service('authDataService', authDataService);

function authDataService($http, $q, adminConstant) {

    var service = {
        gwLogin : gwLogin, //API GW 로그인
        verifyLicense : verifyLicense, //개방형 라이선스 인증
        verifyBizLicense : verifyBizLicense, //비즈 사용자 인증
        updateLoginFailInfo : updateLoginFailInfo,
        updateFailCntReset : updateFailCntReset,
        findMbrId : findMbrId,
        findMbrInfo : findMbrInfo,
        updateMbrRanPwd : updateMbrRanPwd,
        changeUserPwd : changeUserPwd,
    };
    return service;

    /**
     * API GW 로그인
     * @param userInfo
     */
    function gwLogin(userInfo){
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: adminConstant.authPath + '/oauth/token',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded; charset=utf-8' ,
                'Authorization':'Basic ' + setTokenInit()
            },
            data: serializeData(userInfo)
        };
        return $http(req)
            .success(function(response){
                deferred.resolve(response);
            })
            .error(function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    }

    /**
     * 로그인 실패회수 초기화
     */
    function updateFailCntReset(addInfo) {
        return $http.put(adminConstant.contextPathV1+'mbr/updateFailCntReset', addInfo, {headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('dash_token')}});
    }
    /**
     * 로그인 실패 업데이트
     */
    function updateLoginFailInfo(addInfo, clientToken) {
        return $http.post(adminConstant.contextPathV1+'mbr/updateLoginFailInfo', addInfo, {headers:{'Authorization': 'Bearer ' + clientToken}});
    }

    /**
     * 개방형 유료 라이선스 인증
     */
    function verifyLicense(portalLoginInfo) {
        var deferred = $q.defer();
        return $http.post(adminConstant.contextPathV11 + 'member/login', portalLoginInfo, {headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('dash_token')}})
            .success(function(response){
                deferred.resolve(response);
            })
            .error(function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    }

    /**
     * 비즈 사용자 인증
     */
    function verifyBizLicense(portalLoginInfo) {
        var deferred = $q.defer();
        return $http.post(adminConstant.contextPathV11 + 'biz/member/login', portalLoginInfo, {headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('dash_token')}})
            .success(function(response){
                deferred.resolve(response);
            })
            .error(function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    }

    /**
     * 사용자 아이디 찾기
     */
    function findMbrId(param) {
        return $http.get(adminConstant.contextPathV1 + 'mbrs?delYn=N&pageNum=1&pageCon=1&'+param, {
            headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('dash_token')}
        });
    }

    /**
     * 사용자 정보 찾기
     */
    function findMbrInfo(param) {
        return $http.get(adminConstant.contextPathV1 + 'mbrs?delYn=N&pageNum=1&pageCon=1&mbrId='+param.mbrId+'&email='+param.email, {
            headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('dash_token')}
        });
    }

    /**
     * 사용자 비밀번호 재발급
     */
    function updateMbrRanPwd(param) {
        return $http.put(adminConstant.portalPath + 'mbr/updatePwd', param, {
            headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('dash_token')}
        });
    }

    /**
     * 사용자 비밀번호 재발급 정책
     */
    function changeUserPwd(param) {
        return $http.put(adminConstant.contextPathV1 + 'mbr/changePwd', param, {
            headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('temp_access_token'),'Content-Type':'application/json'}
        });
    }

    /**
     * setTokenInit
     * @returns {string}
     */
    function setTokenInit() {
        var msgKeyData = 'MjZiZWMxOGNiNjg0NGU2ZWJlYzYxYmVhNTZlOWIxZDExNDMyMjA2OTg4OTU0' + ':' + 'YzI4NTkxOWQxNjdmNDk1YzgyNTg4OWFiZTBiYTcxMGQxNDMyMjA2OTg4OTU0'; //openp
        if (!window.btoa) window.btoa = $.base64.encode;
        if (!window.atob) window.atob = $.base64.decode;
        var msgKeyDataEncodes = window.btoa(msgKeyData);
        return msgKeyDataEncodes;
    }

    /**
     * serializeData
     * @param data
     * @returns {string}
     */
    function serializeData(data) {
        // If this is not an object, defer to native stringification.
        if ( ! angular.isObject( data ) ) {
            return( ( data == null ) ? '' : data.toString() );
        }
        var buffer = [];
        // Serialize each key in the object.
        for ( var name in data ) {
            if ( ! data.hasOwnProperty( name ) ) {
                continue;
            }
            var value = data[ name ];
            buffer.push(
                encodeURIComponent( name ) +
                '=' +
                encodeURIComponent( ( value == null ) ? '' : value )
            );
        }
        // Serialize the buffer and clean it up for transportation.
        var source = buffer
            .join( '&' )
            .replace( /%20/g, '+' );
        return( source );
    }

}
