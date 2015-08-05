/*
 * 关于各个页面的模板，即初始页面加载使用的模板
 * 作者: Zhang Fan
 * 写于: 2011-6-15
 * 最新修改于： 2012-4-17
 */
//====================================== 自己的状态start ======================================
function writeMyfeed(total){
	var result = "";
	for(var one in total){
		result += writeOneMyfeed(JSON.parse(localStorage.userInfo),total[one]);
	}
	return result;
}
function writeOneMyfeed(user, one){
	var params = [];
	// 如果含有地址信息，显示地理位置
	if(one.place){
		params.push(' &middot; 在 <a href="http://places.renren.com/web/PoiInfo?id=' + one.place.lbs_id + '&type=2&statID=' + one.status_id + '&level=" target="_blank">' + one.place.name + '</a>');
	}else{
		params.push(' ');
	}
	return '<li id="' + one.status_id + '">'
			+ '<img class="post_actorpic" src="' + user.tinyurl + '" style="width:50px;height:50px"/>'
			+ '<div class="post_content">'
				+ '<div class="post_actors">'
					+ '<a href="http://www.renren.com/profile.do?id=' + user.uid + '" target="_blank">' + user.name + '</a>'
				+ '</div>'
				+ '<div class="message">' + formatMessage(one.message)
					+ '<div style="overflow:hidden"></div>'
				+ '</div>'
				+ '<div class="options">'
					+ '<span title="' + one.time + '" class="timestring">' + prettyDate(one.time) + '</span>' + params[0]
				+ '</div>'
				+ '<div class="post_comments">'
					+ '<div>'
						+ '<div class="post_comment"' + (one.comment_count == 0?' style="display:none"':'') + '>'
							+ '<a href="#' + one.status_id + '" onclick="getComments(this,' + one.uid + ',' + one.status_id + ',10)" class="view_all_comments">查看全部' + (one.comment_count > 50?(one.comment_count+'条回复中最新的50条'):(one.comment_count+'条回复')) + '</a>'
						+ '</div>'
					+ '</div>'
					+ '<div class="post_comment">'
						+ '<div class="comment_form" title="' + one.status_id + '">'
							+ '<input type="text" class="comment_input" placeholder="点击添加回复" onfocus="showCommentBox(this)" onblur="hideCommentBox(this)" />'
							+ '<input type="button" class="button smallbutton" value="回复" style="display:none" onclick="addComment(this,' + one.uid + ',' + one.status_id + ',10)" />'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</li>';
}
//========================================自己的状态end==================================

//=========================================新鲜事start==================================
/* 新鲜事模板 */
function writeNewsfeed(total){
	var result = "";
	for(var i in total){
		result += writeOneNewsfeed(total[i]);
	}
	return result;
}
function writeOneNewsfeed(one){
	var params = [];
	// 如果不是状态，可能没有message
	if(one.message && one.message != ""){
		params["message"] = formatMessage(one.message);
	}
	// 如果含有地址信息，显示地理位置
	if(one.place){
		params["place"] = ' &middot; 在 <a href="'+ one.place.url +'">' + one.place.name + '</a>';
	}
	// 如果是分享的链接带有图片或是视频信息
	if(one.attachment && one.attachment[0]){
		params["attachment"] = '';
		if(one.attachment[0].href)
			params["attachment"] += '<a href="' + one.attachment[0].href + '" target="_blank">';
			if(one.attachment[0].src){
				params["attachment"] += '<div class="post_pictures"><img src="' + one.attachment[0].src + '" class="post_picture" /></div>';
			}
			params["attachment"] += '</a>';
	}
	// 如果是日志，分享链接，图片或视频，则带有题目，link和概要
	if(one.title){
		if(one.href){
			params["title"] = '<a href="' + one.href + '" target="_blank">' + one.title + '</a>';
		}else{
			params["title"] = one.title;
		}
	}
	// 概要
	if(one.description){
		params["description"] = '<p>' + one.description + '</p>';
	}
	// 支持转发的类型，显示（转发状态，分享其他分享）
	if(one.feed_type == 10){
		params["forward"] = ' &middot; <a href="#null" onclick="forwardStatus(' + one.actor_id + ',' + one.source_id + ')">转发</a>';
	}
	// 提供like,unlike操作此条目
	if(one.likes && one.likes.user_like == 0){
		// 不支持like操作的不显示
		if(parseInt(one.feed_type/10) == 5){
			params["userLike"] = ' &middot; <a href="#">喜欢</a>';			
		}
	}else{
		params["userLike"] = ' &middot; <a href="#">取消喜欢</a>';
	}
	// 有人表示喜欢的话，显示
	if(one.likes && one.likes.total_count > 0){
		params["likes"] = '<div class="post_likes">'
			+ formatLikes(one.likes)
			+ '</div>';
	}
	// 如果存在评论
	if(one.comments && one.comments.count > 0){
		params["comments"] = "";
		if(one.comments.count > 2){
			var cmt = [];
			for(var i in one.comments.comment){
				cmt[i] = showDefNewsfeedComment(one.comments.comment[i]);
			}
			// 多余2条时是两条中间夹着的式样
			params["comments"] = cmt[0]
				+ '<div class="post_comment">'
					+ '<a class="view_all_comments" href="#' + one.post_id +'" onclick="getComments(this,' + one.actor_id + ',' + one.source_id +',' + one.feed_type + (one.attachment && one.attachment[0] && one.attachment[0].media_id?(','+one.attachment[0].media_id):'') + ')">查看全部' + (one.comments.count > 50?(one.comments.count+'条回复中最新的50条'):(one.comments.count+'条回复')) + '</a>'
				+ '</div>'
				+ cmt[1];
		}else{
			var cmt = [];
			for(var i in one.comments.comment){
				cmt[i] = showDefNewsfeedComment(one.comments.comment[i]);
			}
			// 少于两条就都显示
			for(var i in cmt){
				params["comments"] += cmt[i];
			}
		}
	}
	// 整合一个newsfeed
	return '<li id="' + one.post_id + '">'
			+ '<img class="post_actorpic" src="' + one.headurl + '" style="width:50px;height:50px" />'
			+ '<div class="post_content">'
				+ '<div class="post_actors">'
					+ '<a href="http://www.renren.com/profile.do?id=' + one.actor_id + '" target="_blank">' + one.name + '</a>  ' + (one.prefix && one.feed_type != 10?one.prefix:'')
				+ '</div>'
				+ '<div class="message">'
					+ (one.message?params["message"]:'')
					+ '<div style="overflow:hidden">'
						+ (one.attachment && one.attachment[0]?params["attachment"]:'')
						+ (one.title && one.feed_type != 10?params["title"]:'')
						+ (one.description?params["description"]:'')
					+ '</div>'
				+ '</div>'
				+ '<div class="options">'
					+ '<span class="timestring" title="' + one.update_time + '">' + prettyDate(one.update_time) + '</span>'
					+ (one.place?params["place"]:'')
					+ (one.feed_type == 10?params["forward"]:'')
					+ ((false && one.likes.user_like != "undefined" && parseInt(one.feed_type/10) == 5)?params["userLike"]:'')
				+ '</div>'
				+ '<div class="post_comments">'
					+ (one.likes && one.likes.total_count > 0?params["likes"]:'')
					+ '<div>'
						+ (one.comments && one.comments.count > 0?params["comments"]:'')
					+ '</div>'
					/*+ ((parseInt(one.feed_type/10) != 5 && one.feed_type != 21 && one.feed_type != 23 && one.feed_type != 32 && one.feed_type != 33 && one.feed_type != 36)?*/
					+'<div class="post_comment">'
						+ '<div class="comment_form" title="' + one.post_id + '">'
							+ '<input type="text" class="comment_input" placeholder="点击添加回复" onfocus="showCommentBox(this)" onblur="hideCommentBox(this)" />'
							//+ (one.feed_type == 10?'<input type="checkbox" value="' + one.source_id + '">同时转发':'')
							+ '<input type="button" class="button smallbutton" value="回复" style="display:none" onclick="addComment(this,' + one.actor_id + ',' + one.source_id +',' + one.feed_type + (one.attachment && one.attachment[0] && one.attachment[0].media_id?(','+one.attachment[0].media_id):'') + ')" />'
						+ '</div>'
					+ '</div>'/*:'')*/
				+ '</div>'
			+ '</div>'
		+ '</li>';

}
//===========================================新鲜事end=========================================

//===========================================好友start========================================
/* 好友列表页面模板 */
function writeFriends(total){
	var result = "";
	for(var i in total){
		result += writeOneFriend(total[i]);
	}
	return result;
}
function writeOneFriend(one){
	return '<li>'
			+ '<img class="post_actorpic" src="' + one.tinyurl + '" style="width:36px;height:36px" />'
			+ '<div class="post_content">'
				+ '<a href="http://www.renren.com/profile.do?id=' + one.id + '" target="_blank">' + one.name +'</a>'
				+ '<div class="options">'
					+ '<a href="http://www.renren.com/profile.do?id=' + one.id +'" target="_blank">前往个人主页</a> &middot; '
					+ '<a href="http://gift.renren.com/show/gift/home?fid=' + one.id + '" target="_blank">送TA礼物</a>'
				+ '</div>'
			+ '</div>'
		+ '</li>';
}
//=============================================好友end=======================================

//============================================回复模板 start===============================================
/* 
 * 显示新鲜事默认返回的回复（最多2条的） 
 * 不能改了，因为新鲜事返回的默认回复参数
 */
function showDefNewsfeedComment(one){
	return '<div class="post_comment">'
			+ '<img class="post_actorpic" src="' + one.headurl + '"/>'
			+ '<div class="post_comment_content">'
				+ '<a href="http://www.renren.com/profile.do?id="' + one.uid + '" target="_blank">' + one.name + '</a>  '
				+ one.text.substr(1,one.text.length-2).replace(/\\/g,"") // 新鲜事默认值中所有"前都了一个反斜杠
				+ '<div class="options">'
					+ '<span class="timestring" title="' + one.time + '">' + prettyDate(one.time) + '</span>'
					+ (one.uid != localStorage.userId?('  &middot;  <a href="#null" onclick="replyComment(this,' + one.uid + ',' + "'" + one.name + "'" + ')">回复</a>'):'')
				+ '</div>'
			+ '</div>'
		+ '</div>';
}

/* 显示点击后获取的全部回复 
 * total内容按时间由新到旧
 * 逆序输出
 */
function showComments(total, type){
	var com = "";
	for(var i = (total.length - 1); i >= 0 ; i--){
		com += generateOneComment(total[i], type);
	}
	return com;
}

/* 显示点击后获取的全部回复
 * total内容按时间由旧到新
 * 逆序输出（有的api不支持order）
 */
function showCommentsOld(total, type){
	var com = "";
	for(var i in total){
		com += generateOneComment(total[i], type);
	}
	return com;
}

/* 生成一个回复的模板 */
function generateOneComment(one, type){
	//统一参数表示
	var params = new Array(); 
	if(type == 1){
		// status
		params["comment_id"] = one.comment_id;
		params["uid"] = one.uid;
		params["name"] = one.name;
		params["tinyurl"] = one.tinyurl;
		params["time"] = one.time;
		params["content"] = one.text;
	}else if(type == 2){
		// blog
		params["comment_id"] = one.id;
        params["uid"] = one.uid;
        params["name"] = one.name;
        params["tinyurl"] = one.headurl;
        params["time"] = one.time;
        params["content"] = one.content;
	}else if(type == 3){
		// ablum
		params["comment_id"] = one.comment_id;
        params["uid"] = one.uid;
        params["name"] = one.name;
        params["tinyurl"] = one.headurl;
        params["time"] = one.time;
        params["content"] = one.text;
	}else if(type == 5){
		// share
		params["comment_id"] = one.id;
        params["uid"] = one.uid;
        params["name"] = one.name;
        params["tinyurl"] = one.headurl;
        params["time"] = one.time;
        params["content"] = one.content;
	}
	return '<div class="post_comment" id="' + params.comment_id + '" >'
			+ '<img class="post_actorpic" src="' + params.tinyurl + '" />'
			+ '<div class="post_comment_content">'
				+ '<a href="http://www.renren.com/profile.do?id="' + params.uid + '" target="_blank">' + params.name + '</a>  ' + params.content
				+ '<div class="options">'
					+ '<span title="' + params.time + '" class="timestring">' + prettyDate(params.time) + '</span>'
					+ (params.uid != localStorage.userId?('  &middot;  <a href="#null" onclick="replyComment(this,' + params.uid + ',' + "'" + params.name + "'" + ')">回复</a>'):'')
				+ '</div>'
			+ '</div>'
		+ '</div>';
}
//============================================回复模板 end===============================================

//============================================模板样式补充函数=========================================
// 替换文字url为链接
function formatMessage(msg){
	msg = msg.replace(
			/((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
			function(url){return '<a href="'+ url +'" target="_blank">'+ url +'</a>';}
			);
	return msg.replace(/<3/g,"&hearts;").replace(/[\n\r]/g,"<br />");
}

// 修改喜欢操作为fb的样式
function formatLikes(likes) {
	var out = "";
	if(likes.user_like == 1){
		out = "你";
	}
	if(likes.total_count >= 2) {
		out += "和另外" + (likes.total_count - 1) + "人表示喜欢.";
	} else if(likes.count == 1) {
		out += "表示很喜欢.";
	} else {
		out += "没人表示喜欢.";
	}
	return out;
}

// 显示发布时间到现在的时间差
// JavaScript Pretty Date
// Copyright (c) 2008 John Resig (jquery.com)
// Licensed under the MIT license.
// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
	
	var m = time.match(/^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):*(\d\d)*\s*$/);
	// 防止有些传递时间没有秒
	if(typeof m[6]  == "undefined"){
		m[6] = 0;
	}

	var date;
	try {
		date = new Date(m[1],m[2]-1,m[3],m[4],m[5],m[6]);
	}catch(e) {
		date = new Date(time);
	}

	diff = (((new Date()).getTime() - date.getTime()) / 1000),
	day_diff = Math.floor(diff / 86400);

	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return "至少一个月以前";

	return day_diff == 0 && (
			diff < 60 && "刚刚更新" ||
			diff < 120 && "1分钟前" ||
			diff < 3600 && Math.floor( diff / 60 ) + "分钟前" ||
			diff < 7200 && "1小时前" ||
			diff < 86400 && Math.floor( diff / 3600 ) + "小时前") ||
			day_diff == 1 && "昨天" ||
			day_diff < 7 && day_diff + "天前" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + "星期前";
}