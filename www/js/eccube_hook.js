window.setupAppData = function(params) {
  window.appData = params.data;
  window.onAppFinishCallback = params.callback;

  console.log("setupdata done..");
}
window.startup = function() {
	console.log("KEdit App Startup...");
};

console.log("setupdata go here");
