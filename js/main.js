/*
 * 对于页面整体的控制
 * 作者: Zhang Fan
 * 作于: 2011-6-12
 */
//=================================页面加载完成时自动执行的一些设置 start=============================
window.onload = function(){
	/* 设置左上角的用户头像 */
	if(RR.token()) {
		if(!localStorage.userInfo){
			// 第一次运行时储存当前用户信息
		    RR.api({"method": "users.getLoggedInUser"}, function(res){
		    	if(!res.error_code){
		    		localStorage.userId = res.uid;		
		    		// 查询当前用户信息
		    		RR.api({
		    			"method": "users.getInfo",
		    			"uids": localStorage.userId
		    			},function(res){
			    			if(!res.error_code){
			    				//　写入本地数据
			    				localStorage.userInfo = JSON.stringify(res[0]);
			    				// 直接显示
			    				document.getElementById("profilepic").style.backgroundImage = "url(" + res[0].tinyurl + ")";	
			    			}else{
								console.log(res.error_code + " : " + res.error_msg);
							}
		    		});
		    	}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		    });
		}else{
			// 以后直接调用数据
			var userInfo = JSON.parse(localStorage.userInfo);
			document.getElementById("profilepic").style.backgroundImage = "url(" + userInfo.tinyurl + ")";				
		}
	}else{
		RR.login();
	}
	
	/* 默认显示新鲜事,否则显示记录的页面 */
	if(localStorage.lastTab){
		document.getElementById(localStorage.lastTab).onclick();
	}else{
		document.getElementById("newsfeed_icon").onclick();
	}
	
	/* 如果有通知,显示数字在icon下（暂不支持）
	if(localStorage.notificationCount && localStorage.notificationCount != "0"){
		document.getElementById("notification_count").style.display = "block";
	}*/
};
//=================================页面加载完成时自动执行的一些设置 end=============================

//=================================发布类型下拉菜单的控制函数 start===============================
/* 显示发布类型列表 */
function dropdownList() {
	document.getElementById("type_dropdown").style.display = "block";
}

/* 选择发布类型,改变发布框内容 */
function selectPublisherType(ctrl) {
	ctrl.parentNode.style.display = "none";
	document.getElementById("places_dropdown_wrap").style.display = "none";
	// 用新选择的type替换旧的
	document.getElementById("type_select").innerHTML = ctrl.innerHTML;
	// 更新Mode,用于分辨提交
	var publisherMode = document.getElementById("publisher_mode");
	
	if(ctrl.id == "type_1"){
		// 状态
		publisherMode.value = "status";
		document.getElementById("publisher_text").placeholder = "你正在干嘛？";
		document.getElementById("post_button").value = "发布";
	}else if(ctrl.id == "type_2"){
		// 分享链接
		publisherMode.value = "link";
		document.getElementById("publisher_text").placeholder = "分享当前页面,可以在此添加你的评论";
		document.getElementById("post_button").value = "分享";
	}else if(ctrl.id == "type_3"){
		// 分享视频
		publisherMode.value = "video";
		document.getElementById("publisher_text").placeholder = "分享当前页面中的视频,可以在此添加你的评论";
		document.getElementById("post_button").value = "分享";
	}else{
		// 签到
		publisherMode.value = "checkin";
		document.getElementById("publisher_text").placeholder = "你正在干嘛？";
		document.getElementById("post_button").value = "签到";
		// 显示地点控件
		var wrap = document.getElementById("places_dropdown_wrap");
		var loclist = document.getElementById("places_dropdown");
		var plctext = document.getElementById("places_text");
		
		wrap.style.display = "block";
		//　本地储存列表方案
		if(localStorage.locations && localStorage.locations != "[]"){
			loclist.style.display = "inline";
			document.getElementById("places_toinput").style.display = "inline";
			plctext.style.display = "none";
			var loc = JSON.parse(localStorage.locations);
			loclist.innerHTML = "";
			for(var i in loc){
				loclist.innerHTML += '<option value="' + loc[i].id + '">' + loc[i].name + '</option>';				
			}
		}else{
			//　显示输入地址名字
			loclist.style.display = "none";
			document.getElementById("places_toinput").style.display = "none";
			plctext.style.display = "block";
			// 获取当前地理位置
			getCurrentGeo();
		}// end else 签到
	} //end else
}
//=================================发布类型下拉菜单的控制函数 end===============================

//================================按钮,输入框的样式控制函数start================================
/* 处理鼠标按键后按钮的式样变化 */
function buttonDown(button){
	button.className += " downstate";
}
function buttonUp(button){
	button.className = "button";
}
function buttonOut(button){
	button.className = "button";
}

/* 当鼠标焦点在留言框时,显示留言框和回复按钮 */
function showCommentBox(ctrl){
	if(ctrl.placeholder == "点击添加回复" && document.getElementById("replyTarget").value != ""){
		document.getElementById("replyTarget").value = "";
		// 回复其他回复状态的placeholder
		var otherBoxes = document.getElementsByClassName("comment_input");
		for(var i = 0; i < otherBoxes.length ; i++){
			otherBoxes[i].placeholder = "点击添加回复";
		}
	}
	ctrl.parentNode.getElementsByClassName("smallbutton")[0].style.display = "block";
}
/* 当鼠标焦点离开留言框, */
function hideCommentBox(ctrl){
	if(ctrl.value.length == 0 || ctrl.value.length == ""){
		ctrl.parentNode.getElementsByClassName("smallbutton")[0].style.display = "none";		
	}
}

/* logout按钮 */
function logout(){
	RR.logout(function(res){
		if(res){
			// 如果成功了，清楚该用户所有本地储存数据
			chrome.browserAction.setBadgeText({"text":""});
			chrome.borwserAction.setPopup({"popup":""});
			localStorage.clear();
			window.close();			
		}
	});
}
//========================================按钮,输入框的样式控制函数 end===============================

//====================================各类链接操作的函数（如回复,喜欢等）start============================
/* 添加签到地点 */
function places_listToinput(){
	document.getElementById("places_dropdown").style.display = "none";
	document.getElementById("places_toinput").style.display = "none";
	document.getElementById("places_text").style.display = "block";
	// 获取当前所处地理坐标
	getCurrentGeo();
}

/* 删除签到地址下拉列表中选定的地址 */
function places_remove(){
	if(localStorage.locations && localStorage.locations != "[]"){
		var locs = JSON.parse(localStorage.locations);
		locs.splice(document.getElementById("places_dropdown").selectedIndex, 1);
		localStorage.locations = JSON.stringify(locs);
		// 刷新签到控件,主要是刷新下拉菜单
		selectPublisherType(document.getElementById("type_4"));
	}
}

/* 添加回复信息 */
function replyComment(ctrl, uid, uname){
	// 回复其他回复状态的placeholder
	var otherBoxes = document.getElementsByClassName("comment_input");
	for(var i = 0; i < otherBoxes.length ; i++){
		otherBoxes[i].placeholder = "点击添加回复";
	}
	// 保存回复的状态的用户信息
	document.getElementById("replyTarget").value = uid;
	var commentBox = ctrl.parentNode.parentNode.parentNode.parentNode.nextSibling.getElementsByClassName("comment_input")[0];
	commentBox.placeholder = "回复" + uname + ": ";
}

/* 
 * 获取新鲜事回复(支持相应的UGC回复)
 * ftype是新鲜事类型号,ctrl是呼叫此函数的dom控件,一般是查看更多回复的<a>Tag
 * (optional)mid是相片id等
 */
function getComments(ctrl, uid, sid , ftype, mid){
	// 新鲜事分类二位数字的第一位是类别
	// 1是状态，2是日志，3是照片，5是分享
	var type = parseInt(ftype/10);
	
	if(ftype == 10 || ftype == 11){
		// status
		RR.api({
			"method": "status.getComment",
			"status_id": sid,
			"owner_id": uid,
			"count": 50,
			"order": 1
			},function(res){
				if(!res.error_code){
					// 显示回复
					ctrl.parentNode.parentNode.innerHTML = showComments(res,type);
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		});
	}else if(ftype == 20 || ftype == 22){
		// Blog
		RR.api({
			"method": "blog.getComments",
			"id": sid,
			"uid": uid,
			"count": 50,
			"order": 1
			},function(res){
				if(!res.error_code){
					ctrl.parentNode.parentNode.innerHTML = showComments(res,type);
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		});
	}else if(ftype == 30 || ftype == 31){
		// album
		var para = {
				"method": "photos.getComments",
				"pid": mid,
				"aid": sid,
				"uid": uid,
				"count": 50,
				"order": 1
				};
		RR.api(para, function(res){
				if(!res.error_code){
					ctrl.parentNode.parentNode.innerHTML = showComments(res,type);
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		});
	}else{
		// share
		RR.api({
			"method": "share.getComments",
			"share_id": sid,
			"user_id": uid,
			"count": 50,
			"order": 1
			},function(res){
				if(!res.error_code){
					ctrl.parentNode.parentNode.innerHTML = showCommentsOld(res.comments, 5); //有的分享ftype不是5开头，都按5算
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		});
	}
}

/* 添加新鲜事回复(支持相应的UGC回复) */
function addComment(ctrl, uid, sid , ftype, mid){
	// 新鲜事分类二位数字的第一位是类别
	// 1是状态，2是日志，3是照片，5是分享
	//var type = parseInt(ftype/10);
	var textBox = ctrl.parentNode.firstChild;
	var text = textBox.value;
	// 锁定输入框
	textBox.disabled = true;
	// 被回复者id
	var replyTarget = document.getElementById("replyTarget");
	
	if((ftype == 10 || ftype == 11) && text.length > 0){
		// status
		var para = {
				"method": "status.addComment",
				"owner_id": uid,
				"status_id": sid,
				"content": text
				};
		if(replyTarget.value != ""){
			para["rid"] = replyTarget.value;
		}
		RR.api(para,function(res){
				if(!res.error_code && res.result == 1){
					textBox.value = "";
					ctrl.style.display = "none";
					// 刷新留言
					if(!ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0]){
						//目前评论不超过2条或评论已经被展开
						var uinfo = JSON.parse(localStorage.userInfo);
						ctrl.parentNode.parentNode.parentNode.firstChild.innerHTML += 
							'<div class="post_comment">'
								+ '<img class="post_actorpic" src="' + uinfo.tinyurl + '" />'
								+ '<div class="post_comment_content">'
									+ '<a href="http://www.renren.com/profile.do?id="' + uinfo.uid + '" target="_blank">' + uinfo.name + '</a>  ' + (replyTarget.value == ""?text:(textBox.placeholder+text))
									+ '<div class="options">'
										+ '<span title="just now" class="timestring">刚刚更新</span>'
									+ '</div>'
								+ '</div>'
							+ '</div>';
					}else{
						getComments(ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0], uid, sid, ftype);
					}
					// 清空被回复者id，防止回复多次
					replyTarget.value = "";
					textBox.placeholder = "点击添加回复";
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		});

	}else if((ftype == 20 || ftype == 22) && text.length > 0){
		// blog
		var para = {
				"method": "blog.addComment",
				"uid": uid,
				"id": sid,
				"content": text
				};
		if(replyTarget.value != ""){
			para["rid"] = replyTarget.value;
		}
		RR.api(para,function(res){
				if(!res.error_code && res.result == 1){
					textBox.value = "";
					ctrl.style.display = "none";
					if(!ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0]){
						//目前评论不超过2条或评论已经被展开,追加显示留言
						var uinfo = JSON.parse(localStorage.userInfo);
						ctrl.parentNode.parentNode.parentNode.firstChild.innerHTML += 
							'<div class="post_comment">'
								+ '<img class="post_actorpic" src="' + uinfo.tinyurl + '" />'
								+ '<div class="post_comment_content">'
									+ '<a href="http://www.renren.com/profile.do?id="' + uinfo.uid + '" target="_blank">' + uinfo.name + '</a>  ' + (replyTarget.value == ""?text:(textBox.placeholder+text))
									+ '<div class="options">'
										+ '<span title="just now" class="timestring">刚刚更新</span>'
									+ '</div>'
								+ '</div>'
							+ '</div>';
					}else{
						// 刷新留言
						getComments(ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0], uid, sid, ftype);
					}
					// 清空被回复者id，防止回复多次
					replyTarget.value = "";
					textBox.placeholder = "点击添加回复";
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		});
	}else if((ftype == 30 || ftype == 31) && text.length > 0){
		// album
		var para = {
				"method": "photos.addComment",
				"aid": sid,
				"uid": uid,
				"content": text
				};
		if(ftype != 33){
			para["pid"] = mid;
		}
		if(replyTarget.value != ""){
			para["rid"] = replyTarget.value;
		}
		RR.api(para,function(res){
			if(!res.error_code && res.result == 1){
				textBox.value = "";
				ctrl.style.display = "none";
				// 刷新留言
				if(!ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0]){
					//目前评论不超过2条或评论已经被展开
					var uinfo = JSON.parse(localStorage.userInfo);
					ctrl.parentNode.parentNode.parentNode.firstChild.innerHTML += 
						'<div class="post_comment">'
							+ '<img class="post_actorpic" src="' + uinfo.tinyurl + '" />'
							+ '<div class="post_comment_content">'
								+ '<a href="http://www.renren.com/profile.do?id="' + uinfo.uid + '" target="_blank">' + uinfo.name + '</a>  ' + (replyTarget.value == ""?text:(textBox.placeholder+text))
								+ '<div class="options">'
									+ '<span title="just now" class="timestring">刚刚更新</span>'
								+ '</div>'
							+ '</div>'
						+ '</div>';
				}else{
					if(ftype != 33){
						getComments(ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0], uid, sid, ftype, mid);
					}
					else{						
						getComments(ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0], uid, sid, ftype);
					}
				}
				// 清空被回复者id，防止回复多次
				replyTarget.value = "";
				textBox.placeholder = "点击添加回复";
			}else{
				console.log(res.error_code + " : " + res.error_msg);
			}
		});
	}else if(text.length > 0){
		//share
		var para = {
				"method": "share.addComment",
				"user_id": uid,
				"share_id": sid,
				"content": text
				};
		if(replyTarget.value != ""){
			para["to_user_id"] = replyTarget.value;
		}
		RR.api(para,function(res){
				if(!res.error_code && res.result == 1){
					textBox.value = "";
					ctrl.style.display = "none";
					if(!ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0]){
						//目前评论不超过2条或评论已经被展开,追加显示留言
						var uinfo = JSON.parse(localStorage.userInfo);
						ctrl.parentNode.parentNode.parentNode.firstChild.innerHTML += 
							'<div class="post_comment">'
								+ '<img class="post_actorpic" src="' + uinfo.tinyurl + '" />'
								+ '<div class="post_comment_content">'
									+ '<a href="http://www.renren.com/profile.do?id="' + uinfo.uid + '" target="_blank">' + uinfo.name + '</a>  ' + (replyTarget.value == ""?text:(textBox.placeholder+text))
									+ '<div class="options">'
										+ '<span title="just now" class="timestring">刚刚更新</span>'
									+ '</div>'
								+ '</div>'
							+ '</div>';
					}else{
						// 刷新留言
						getComments(ctrl.parentNode.parentNode.parentNode.getElementsByClassName("view_all_comments")[0], uid, sid, ftype);
					}
					// 清空被回复者id，防止回复多次
					replyTarget.value = "";
					textBox.placeholder = "点击添加回复";
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
		});
	};
	
	// 解锁输入框
	textBox.disabled = false;
}

/* 转发状态 */
function forwardStatus(uid,sid){
	RR.api({
			"method": "status.forward",
			"status": " ",
			"forward_id": sid,
			"forward_owner": uid
		},function(res){
			if(!res.error_code && res.result == 1){
				// refresh
				document.getElementsByClassName("selected")[0].onclick();
			}else{
				console.log(res.error_code + " : " + res.error_msg);
			}
		});
}
//===============================各类链接操作的函数（如回复,喜欢等）end============================

//=======================================发布新鲜事start=====================================
/* 发布状态,分享等 */
function publish(){
	// 各种类型
	var type = document.getElementById("publisher_mode").value;
	if(type == "status"){
		// 锁定输入框并获取内容
		var input = document.getElementById("publisher_text");
		var text = input.value;
		input.disabled = true;
		
		if(text.length > 0){
			RR.api({
				"method": "status.set",
				"status": text				
			},function(res){
				if(!res.error_code && res.result == 1){
					//console.log("状态发布成功！");
					// 释放输入框
					input.disabled = false;
					// 清空输入框
					input.value = "";
					// 刷新当前页面
					document.getElementsByClassName("selected")[0].onclick();
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
			});
		}
	}else if(type == "link"){
		chrome.tabs.getSelected(null, function(tab){
			// 判断是否是http页面
			var shraedUrl = tab.url.match(/\b(https?:\/\/[^\s]+\.[^\s]{2,4})\b/i)[0];
			if(shraedUrl){
				// api需要的参数
				var params = {
					"method": "share.publish",
					"url": tab.url,
					"type": 6
				};
				// 如果用户添加了评论
				var input = document.getElementById("publisher_text");
				var text = input.value;
				input.disabled = true;
				if(text.length > 0){
					params["comment"] = text;
				}
				RR.api(params, function(res){
					if(!res.error_code && res.result == 1){
						input.disabled = false;
						input.value = "";
						document.getElementsByClassName("selected")[0].onclick();
					}else{
						console.log(res.error_code + " : " + res.error_msg);
					}
				});
			}
		});
	}else if(type == "video"){
		chrome.tabs.getSelected(null, function(tab){
			// 判断是否是http页面
			var shraedUrl = tab.url.match(/\b(https?:\/\/[^\s]+\.[^\s]{2,4})\b/i)[0];
			if(shraedUrl){
				// api需要的参数
				var params = {
					"method": "share.publish",
					"url": tab.url,
					"type": 10
				};
				// 如果用户添加了评论
				var input = document.getElementById("publisher_text");
				var text = input.value;
				input.disabled = true;
				if(text.length > 0){
					params["comment"] = text;
				}
				RR.api(params, function(res){
					if(!res.error_code && res.result == 1){
						input.disabled = false;
						input.value = "";
						document.getElementsByClassName("selected")[0].onclick();
					}else{
						console.log(res.error_code + " : " + res.error_msg);
					}
				});
			}
		});
	}else if(type== "checkin"){
		// 锁定输入框并获取内容
		var input = document.getElementById("publisher_text");
		var text = input.value;
		input.disabled = true;
		// 地址输入框
		var plctext = document.getElementById("places_text");
		// 下拉菜单
		var droplist = document.getElementById("places_dropdown");
		
		if(plctext.style.display == "none"){
			// 锁定地点选择框并获取数据
			droplist.disabled = true;
			var pid = droplist.options[droplist.selectedIndex].value;
			// 直接签到
			RR.api({
				"method": "checkins.checkin",
				"place_id": pid,
				"message": text
				//"latitude": document.getElementById("places_latitude").value,
				//"longitude": document.getElementById("places_longitude").value
			},function(res){
				if(!res.error_code){
					input.disabled = false;
					input.value = "";
					document.getElementsByClassName("selected")[0].onclick();
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
			});
			// 处理完毕,回复控件
			droplist.disabled = false;
		}else{
			// 地址输入框
			plctext.disabled = true;
			
			var pid = MD5( document.getElementById("places_latitude").value + document.getElementById("places_longitude").value);
			// 创建新地点并存入本地
			RR.api({
				"method": "places.create",
				"poi_id": pid,
				"name": plctext.value,
				"address": plctext.value,
				"latitude": document.getElementById("places_latitude").value,
				"longitude": document.getElementById("places_longitude").value
			},function(res){
				if(!res.error_code){
					if(res.place.id != 0){
						// 创建成功
						if(localStorage.locations){
							var locache = JSON.parse(localStorage.locations);
							var newplace = new Object();
							newplace.id = res.place.id;
							newplace.name = plctext.value;
							locache.push(newplace);
							localStorage.locations = JSON.stringify(locache);
						}else{
							var loclist = new Array();
							var newplace = new Object();
							newplace.id = res.place.id;
							newplace.name = plctext.value;
							loclist.push(newplace);
							localStorage.locations = JSON.stringify(loclist);
						}
						// 然后用返回的id签到
						/*
						RR.api({
							"method": "checkins.checkin",
							"place_id": res.place.id,
							"message": text,
							"latitude": document.getElementById("places_latitude").value,
							"longitude": document.getElementById("places_longitude").value
						}*/
						RR.api({
							"method": "status.set",
							"message": text,
							"place_id": res.place.id
							},function(res){
								if(!res.error_code){
									input.disabled = false;
									input.value = "";
									document.getElementsByClassName("selected")[0].onclick();
								}else{
									console.log(res.error_code + " : " + res.error_msg);
								}
						});
					}
				}else{
					console.log(res.error_code + " : " + res.error_msg);
				}
				plctext.value = "";
				input.value = "";
				// 刷新签到控件
				selectPublisherType(document.getElementById("type_4"));
			});
			// 处理完毕,回复控件使用
			input.disabled = false;
			plctext.disabled = false;
		}
	}//end else type="签到"
}
//=========================================发布新鲜事end===================================

//================================================补充函数======================================
/* 获取当前地理位置,并赋值给页面控件 */
function getCurrentGeo(){
	if(!window.LOC){
		setTimeout(function(){
			navigator.geolocation.getCurrentPosition(function(res){
				window.LOC = res.coords;
				// 小数位太多了
				var lat = res.coords.latitude.toString();
				lat = lat.substr(0, lat.length - 4);
				var lng = res.coords.longitude.toString();
				lng = lng.substr(0, lng.length - 4);
				// 纬度
				document.getElementById("places_latitude").value = res.coords.latitude;
				// 经度
				document.getElementById("places_longitude").value = res.coords.longitude;
				document.getElementById("places_text").placeholder = "你现在位于(纬度" + lat + ",经度" + lng + ")";
			},function(res){
				document.getElementById("places_text").placeholder = "抱歉,无法确定你所在的位置";
				console.log(res);
			});
		},400); // end setTimeout
	}
}