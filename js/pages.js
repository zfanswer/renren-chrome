/*
 * 加载各个页面时调用的函数
 * 作者: Zhang Fan
 * 写于: 2011-6-12
 */

//======================================通知页面（暂不支持）start================================
function showNotificationsPage(ctrl){
	localStorage.lastTab = ctrl.id;
	// 切换当前页面icon的式样
	Func.selectCurrentPage(ctrl);
	// 隐藏其他页面
	Func.hidePages();
	document.getElementById("notifications").style.display = "block";
	// 显示新通知
	// sorry, Renren暂没有获取通知的api，WTF
}
//======================================通知页面（暂不支持）end================================

//======================================新鲜事页面start================================
function showNewsfeedPage(ctrl) {
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	// 显示状态输入框
	document.getElementById("newpost").style.display = "block";
	// 显示页面
	document.getElementById("newsfeed").style.display = "block";
	// 加载旧页面内容
	try{
		if(localStorage.newsfeedCache){
			var cache = JSON.parse(localStorage.newsfeedCache);
			// 输出缓存内容
			document.getElementById("newsfeed").innerHTML = writeNewsfeed(cache);
		}
	}catch(e){}
	// 获取新内容
	RR.api({
		method: "feed.get",
		  type: "10,11,20,21,22,23,30,31,32,33,34,35,36,50,51",
		 count: "50"
	},
	function(res){
		if(!res.error_code){
			// 正确获取内容，写入页面
			if(res.length != 0){
				document.getElementById("newsfeed").innerHTML = writeNewsfeed(res);
				localStorage.newsfeedCache = JSON.stringify(res);
			}else{
				console.log("There is nothing published.");
			}
		}else{
			console.log(res.error_code + " : " + res.error_msg);
		}
	});
}
//======================================新鲜事页面end================================

//======================================状态页面start================================
function showStatusPage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("newpost").style.display = "block";
	
	document.getElementById("status").style.display = "block";
	if(localStorage.statusCache){
		var cache = JSON.parse(localStorage.statusCache);
		document.getElementById("status").innerHTML = writeNewsfeed(cache);
	}
	RR.api({
		method: "feed.get",
		type: "10"
	},function(res){
		if(!res.error_code){
			if(res.length != 0){
				document.getElementById("status").innerHTML = writeNewsfeed(res);
				localStorage.statusCache = JSON.stringify(res);
			}else{
				console.log("There is nothing.");
			}
		}else{
			console.log(res.error_code + " : " + res.error_msg);
		}
	});
}
//======================================状态页面end================================

//======================================相册图片页面start================================
function showAlbumPage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("newpost").style.display = "block";
	
	document.getElementById("album").style.display = "block";
	if(localStorage.albumCache){
		var cache = JSON.parse(localStorage.albumCache);
		document.getElementById("album").innerHTML = writeNewsfeed(cache);
	}
	RR.api({
		method: "feed.get",
		type: "30,34"
	},function(res){
		if(!res.error_code){
			if(res.length != 0){
				document.getElementById("album").innerHTML = writeNewsfeed(res);
				localStorage.albumCache = JSON.stringify(res);
			}else{
				console.log("There is nothing.");
			}
		}else{
			console.log(res.error_code + " : " + res.error_msg);
		}
	});
}
//======================================相册图片页面end================================

//======================================日志页面start================================
function showBlogPage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("newpost").style.display = "block";
	document.getElementById("blog").style.display = "block";
	if(localStorage.blogCache){
		var cache = JSON.parse(localStorage.blogCache);
		document.getElementById("blog").innerHTML = writeNewsfeed(cache);
	}
	RR.api({
		method: "feed.get",
		type: "20"
	},function(res){
		if(!res.error_code){
			if(res.length != 0){
				document.getElementById("blog").innerHTML = writeNewsfeed(res);
				localStorage.blogCache = JSON.stringify(res);
			}else{
				console.log("There is nothing.");
			}
		}else{
			console.log(res.error_code + " : " + res.error_msg);
		}
	});
}
//======================================日志页面end================================

//======================================分享页面start================================
function showSharePage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("newpost").style.display = "block";
	
	document.getElementById("share").style.display = "block";
	if(localStorage.shareCache){
		var cache = JSON.parse(localStorage.shareCache);
		document.getElementById("share").innerHTML = writeNewsfeed(cache);
	}
	RR.api({
		method: "feed.get",
		type: "21,32,33,50,51"
	},function(res){
		if(!res.error_code){
			if(res.length != 0){
				document.getElementById("share").innerHTML = writeNewsfeed(res);
				localStorage.shareCache = JSON.stringify(res);
			}else{
				console.log("There is nothing.");
			}
		}else{
			console.log(res.error_code + " : " + res.error_msg);
		}
	});
}
//======================================分享页面end================================

//======================================公共主页页面start================================
function showPublicPage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("newpost").style.display = "block";
	
	document.getElementById("public").style.display = "block";
	if(localStorage.publicCache){
		var cache = JSON.parse(localStorage.publicCache);
		document.getElementById("public").innerHTML = writeNewsfeed(cache);
	}
	RR.api({
		method: "feed.get",
		type: "11,22,23,31,35,36,53,54"
	},function(res){
		if(!res.error_code){
			if(res.length != 0){
				document.getElementById("public").innerHTML = writeNewsfeed(res);
				localStorage.publicCache = JSON.stringify(res);
			}else{
				console.log("There is nothing.");
			}
		}else{
			console.log(res.error_code + " : " + res.error_msg);
		}
	});
}
//======================================公共主页页面end================================

//======================================自己的状态页面start================================
function shwoMyfeedPage(ctrl) {
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("newpost").style.display = "block";
	document.getElementById("myfeed").style.display = "block";
	// 加载旧页面内容
	try{
		if(localStorage.myfeedCache){
			var cache = JSON.parse(localStorage.myfeedCache);
			// 套入模板
			document.getElementById("myfeed").innerHTML = writeMyfeed(cache);
		}
	}catch(e){}
	// 获取新内容
	RR.api({
		method: "status.gets",
		count: "15"
		},function(res){
			if(!res.error_code){
				// 正确获取内容，写入页面并缓存
				document.getElementById("myfeed").innerHTML = writeMyfeed(res);
				localStorage.myfeedCache = JSON.stringify(res);
			}else{
				console.log(res.error_code + " : " + res.error_msg);
			}
	});
}
//======================================自己的状态页面end================================

/*//======================================留言板页面start（暂不支持）================================
function showMycommentsPage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("mycomments").style.display = "block";
	if(localStorage.mycommentsCache){
		var cache = JSON.parse(localStorage.mycommentsCache);
	}
	RR.api({
		method: ""
	},function(res){
		
	});
}
//======================================状态页面end================================*/

/*//====================================== 站内信页面start（暂不支持）================================
function showInboxPage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	document.getElementById("inbox").style.display = "block";
}*/
//=========================================站内心页面end================================

//======================================好友页面end================================
/* 每次加载页面第一次要重新读取好友列表（可能期间添加了新好友） */
var loadedFriends = false;
function showFriendsPage(ctrl){
	localStorage.lastTab = ctrl.id;
	Func.selectCurrentPage(ctrl);
	Func.hidePages();
	// hide发布类型列表
	document.getElementById("type_dropdown").style.display = "none";
	document.getElementById("friends").style.display = "block";
	document.getElementById("friendsort").style.display = "block";
	if(loadedFriends){
		if(localStorage.friendsCache){
			if(document.getElementById("friendsort_text").value != ""){
				document.getElementById("friendsort_text").onkeyup();
			}else{
				var cache = JSON.parse(localStorage.friendsCache);
				document.getElementById("friends").innerHTML = writeFriends(cache);
			}
		}
	}else{
		RR.api({method: "friends.getFriends"}, function(res){
			if(!res.error_code){
				// 正确获取内容
				loadedFriends = true;
				// 按名字排序
				res.sort(function(a,b){
					var x = a.name;
					var y = b.name;
					return x.localeCompare(y);
				});
				/* 根据好友搜索框显示内容
				if(document.getElementById("friendsort_text").value != ""){
					document.getElementById("friendsort_text").onkeyup();
				}else{
					document.getElementById("friendsort_text").innerHTML = "";
					alert(JSON.stringify(res));
				}*/
				document.getElementById("friends").innerHTML = writeFriends(res);
				localStorage.friendsCache = JSON.stringify(res);
			}else{
				console.log(res.error_code + " : " + res.error_msg);
			}
		});
	}
}
/* 查找好友输入框，随文字变化改变页面内容 */
function searchFriends(ctrl){
	// 从加载过的数据中按输入字符查找
	var friends = JSON.parse(localStorage.friendsCache),
		matches = [],
		text = ctrl.value,
		regx = new RegExp("\\b" + text.replace(/\W/g, '').split('').join('.{0,3}'), "i");
	for(var friend in friends){
		try{
			if(friends[friend].name.match(regx)){
				matches.push(friends[friend]);
			}
		}catch(e){}
	}
	matches.sort(function(a,b){
		var x = a.name;
		var y = b.name;
		return x.localeCompare(y);
	});
	// 刷新页面
	document.getElementById("friends").innerHTML = writeFriends(matches);	
}
//======================================好友页面end================================

//======================================常用自定义函数==============================
var Func = {
	// 只高亮当前页面icon
	selectCurrentPage : function(ctrl){
		var siblings = ctrl.parentNode.childNodes;
		for(var i = 0; i < siblings.length; i++){
			if(typeof siblings[i] != "string"){
				siblings[i].className = "";
			}
		}
		ctrl.className = "selected";
	},
	// 隐藏其他页面
	hidePages : function(){
		var pages = document.getElementsByClassName("page");
		for(var i = 0; i < pages.length; i++){
			pages[i].style.display = "none";
		}
	}
};