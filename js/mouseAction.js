/*
 * Mouse Actions
 * By Fortable1999
 * Developed in 2011-10
 *
 * */

function sendAsRenrenStatus(text){
	//Edit by z.fan
	chrome.tabs.getSelected(null, function(tab){
		var textWithUrl = text + " " + tab.url;
		if(textWithUrl.length > 0 /*&& text.length < 140*/){
			RR.api({
				"method": "status.set",
				"status": textWithUrl
			},function(res){
				if(!res.error_code && res.result == 1){
					//if it's send successfully, show a desktop notification
					var notification = webkitNotifications.createNotification(
							'/img/icon48.png',
							'Status was sent successfully!',
							text);
					notification.ondisplay = function(){
						setTimeout(function(){notification.cancel();},3500);
					};
					notification.show();
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
			});
		};
	});
};

var renrenStatusUpdate = chrome.contextMenus.create({
	"title":"Send this As RenRen Status!",
	"contexts":["selection"],
	"onclick": function(info, tab){sendAsRenrenStatus(info.selectionText);}	
});

/*
 * created by z.fan
 * date: 2011-10-7
 */
function sendToRenrenAlbum(url){
	chrome.tabs.getSelected(null, function(tab){
		var caption = tab.title + " " + tab.url;
		if(caption.length > 0){
			RR.api({
				"method": "photos.upload",
				"upload": url,
				"caption": caption
			},function(res){
				if(!res.error_code && res.result == 1){
					//if it's send successfully, show a desktop notification
					var notification = webkitNotifications.createNotification(
							'/img/icon48.png',
							'Photo was sent successfully!',
							'');
					notification.ondisplay = function(){
						setTimeout(function(){notification.cancel();},3500);
					};
					notification.show();
				}else{
					console.log(res.error_code + " : " + res.error_msg);
					var notification = webkitNotifications.createNotification(
							'/img/icon48.png',
							'Error!',
							res.error_msg);
					notification.ondisplay = function(){
						setTimeout(function(){notification.cancel();},3500);
					};
					notification.show();
				}
			});
		}
	});
}

/*var renrenAlbumUpload = chrome.contextMenus.create({
	"title":"Send this To RenRen Album!",
	"contexts":["image"],
	"onclick": function(info, tab){sendToRenrenAlbum(info.srcUrl);}	
});*/