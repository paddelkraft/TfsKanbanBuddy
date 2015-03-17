

function getApiSnapshots (){
	console.log("get api snapshots");
	ApiUtil().getApiSnapshots();
	setTimeout(getApiSnapshots,300000);
}

getApiSnapshots();
	




