chrome.extension.sendRequest(
	{isRenrenExt: true, session: window.location.hash},
	function(response){
		window.open('','_self','');
		window.close();
	}
);