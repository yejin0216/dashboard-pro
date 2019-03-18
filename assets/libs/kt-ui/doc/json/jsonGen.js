var fs = require('fs');


function genPagedData(pageNum, pageSize, totalPage) {
	var myData = {
				result: true,
				currentPage: pageNum,
				pageSize: pageSize,
				totalPage: totalPage,
				rows :[]
			};

	var pageNumber = pageNum || 1;

	for (var i = ((pageNum*pageSize)-pageSize)+1; i <= pageNum*pageSize; i++) {
		myData.rows.push({ id: "user"+i, name : "사용자"+i, email:"testeamil"+i+"@kt.com", regDate :"2013-01-20" });
	};

	return myData;
}

function getData(total) {
	var myData = {
				result: true,
				rows :[]
			};

	for (var i = 1; i <= total; i++) {
		myData.rows.push({ id: "user"+i, name : "사용자"+i, email:"testeamil"+i+"@kt.com", regDate :"2013-01-20" });
	}

	return myData;
}

function writeFile (fileName, data) {
	fs.writeFile(fileName, JSON.stringify(data, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to "+fileName);
	    }
	});
}

for (var i = 5; i >= 1; i--) {
	var data = genPagedData(i,10,5);
	writeFile("user-page-"+i+".json",data);
};
