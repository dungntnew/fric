window.setupAppData = function(params) {
  window.appData = params.data;
  window.onAppFinishCallback = params.callback;
  console.log("iframe:setupdata done..");
}

window.startup = function() {
	console.log("iframe:KEdit App Startup...");
};

console.log("iframe: on start load..");
if (!parent.KEditAppData) {
	console.log("iframe cannot access parent KEditAppData");
}else {
	console.log("parent app data is: ");
	console.log(JSON.stringify(parent.KEditAppData));
}
