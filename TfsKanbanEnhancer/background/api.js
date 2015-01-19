

function getApiSnapshots (){
	console.log("get api snapshots");
	apiUtil().getApiSnapshots();
	setTimeout(getApiSnapshots,300000);
}

getApiSnapshots();
	




