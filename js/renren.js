/*
 * 人人API调用的封装
 * 作者: Zhang Fan
 * 作于: 2011-6-12
 */

var RR = {
	// Renren API的URL和参数
	api_id : "140612",
	api_key : "e9a919ae27874f7a8a10b8186b6a4812",
	URL : {
		api: "http://api.renren.com/restserver.do",
		oauth: "https://graph.renren.com/oauth/authorize",
		redirectUrl: "http://graph.renren.com/oauth/login_success.html"
	},
	
  	// 检查localStorage中是否存有access_token以及是否过期,如果正常返回access_token
	token : function() {
		if(localStorage.rr_access_token && localStorage.rr_access_token != "false" && localStorage.rr_access_token != "undefinied"
			&& localStorage.rr_token_expire && localStorage.rr_token_expire != 0 && localStorage.rr_token_expire > Date.now()){
			return localStorage.rr_access_token;
		}else{
			return false;
		}
	},

	// 发送oAuth2.0请求
	login : function() {
		//请求的权限
		var scopes = ["read_user_status","read_user_blog","read_user_feed","read_user_share",
		             "read_user_photo","read_user_album","read_user_checkin","read_user_comment",
		             "publish_feed","publish_share","publish_checkin","publish_comment",
		             "status_update","photo_upload","operate_like"];
		var scope = "";
		for(var i = 0; i < scopes.length; i++){
			if(i == 0){
				scope += scopes[i];
			}
			scope += " " + scopes[i];
		}
		//生成请求URL
		var url = this.URL.oauth + "?client_id=" + this.api_key + "&response_type=token"
			+ "&redirect_uri=" + this.URL.redirectUrl
			+ "&scope=" + scope;
		//弹出屏幕，居中
		var w = 580;
		var h = 360;
		var l = (screen.width - w) / 2;
        var t = (screen.height - h) / 2;
        var p = 'width=' + w + ', height=' + h + ', top=' + t + ', left=' + l;
        p += ', toolbar=no, scrollbars=no, menubar=no, location=no, resizable=no';
		window.open(url,"Renren connection",p);
	},
	
	// 去除对此应用的oAuth认证
	logout : function(callback){
		// TODO 移除Renren服务器上的认证信息（Renren未提供）
		callback(true);
	},

	// 调用Renren rest API的入口函数
  	api : function(options, callback) {
  		
		// 预设几个API必须的参数
		options["access_token"] = this.token();
		options["format"] = "JSON";
		options["v"] = "1.0";
		options["call_id"] = Date.now();
		
		// 按字典顺序排序params
		var order = [];
		for(var key in options){
			order.push(key);
		}
		order.sort();
		
  		// 用md5计算要求的签名sig
		md5str = "";
		for(var i = 0; i < order.length; i++){
			if(order[i] != "upload"){
				md5str += order[i] + "=" + options[order[i]];
			}
		}
		var sig = MD5(md5str + "349181b8d9cb41ee82d00f3b0d3dc27d");

		// 组合请求url
		var url = this.URL.api + "?" + order[0] + "=" + options[order[0]];
		for(i = 1; i < order.length; i++){
			url += "&" + order[i] + "=" + encodeURIComponent(options[order[i]]);
		}
		url += "&sig=" + sig;
		
		// 显示 ajax loading 图标
		// Fixed by Fortable1999
		if(document.getElementById("loader")){
			document.getElementById("loader").style.display = "block";
		}
		else{
			console.log("Error in getElementByID: 'loader'");
		}
  		// XMLHttp请求
  		var xhr = new XMLHttpRequest();
  		// 一般情况下Renren要求用POST请求
		xhr.open("POST", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200){
					// 返回response
					// alert(xhr.responseText);
					callback(JSON.parse(xhr.responseText));
					// 隐藏 AJAX loading 图标
					if(document.getElementById("loader")){
						document.getElementById("loader").style.display = "none";
					}
				}else{
					console.log("XMLHttpRequest error.");
					// 隐藏 AJAX loading 图标
					if(document.getElementById("loader")){
						document.getElementById("loader").style.display = "none";
					}
				}
			}
		};
		xhr.send();
  	}
};