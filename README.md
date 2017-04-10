#AJAX

AJAX 问世至今已有10多年了，由IE首先实现，它的出现直接改变了前端工作，前端不在只是给页面加个链接，或仅仅是做些走马灯似的特效，许多逻辑与业务因为ajax的出现，慢慢往前台转移了。

###本文主要讲一下ajax的底层实现和如何不依托任何框架自己写一个ajax工具。

ajax的实质是利用ie开辟的ActiveXObject 和 w3c 提出的 XMLHttpRequest构造器 产生的对象来作为与后台的枢纽。

####一些预备知识
1. 首先请求分为两种
	* GET
	* POST	

	
GET 请求可能会被浏览器缓存, 为了防止获取到缓存的数据，我们在url的后面加一个时间戳，保证每次url不重复。
	
	GET	请求length有限，GET请求也更迅捷。
	
	POST请求length不限，如果要模拟表单，要设置Content-type : 
	application/x-www-form-urlencode(表单提交header, 以
	键值对提交)

### 文件目录
+ ajax.js 司徒大大的终极ajax
+ FounderAjax.js 自己写的ajax
+ server.js node的服务器测试文件
+ index.html 客户端测试


###我们参照jquery 对于Ajax的API来制定我们自己的API
`$.ajax({
url: url,
method: method, 
data: data,
dataType: dateType,
success: function(){
},
error: function(){
}
})`	

这里的	dataType 包含 jsonp , json, text , script, xml , html。jsonp需要指定callback，默认datatype 为text。

  1.默认一个缺省参数

 	var _opts = {
            url: '/',
            type: 'GET',
            dataType: '',
            data: null,
            async: true,
            cache: false,
            timeout: 5,
            load: function () {   	//状态改变时调用
            },
            error: function () {		//请求失败
            },
            success: function () {		//请求成功
            },
            complete: function () {		//请求完成
            }
 	}
 2. 设置timeout 方法
 
 设置一个延时器，在timeout后的间隔里去检测响应状态 只要数据没返回，就abort.
 3. Get 方法把参数拼成queryString, Post 方法直接send queryString的参数就好.
 4.  JSONP 情况我们使用script动态标签来实现，把callback绑在我们的命名空间里，简单写一下loadJS。
 
 <pre>function loadJS(url, callback){
  var doc = document, script =   document.createElement('script'), body = doc.body;
        script.type = 'text/javascript';
        //ie8 不会立即触发，需要手动触发.
        if(script.readyState){
            script.onreadystatechange = function() {
                if(script.readyState === 'loaded' || script.readyState === 'complete'){
                    script.onreadystatechange = null;
                    callback && callback();
                }
            }
        }else{
            script.onload = function(){
                callback && callback();
            }
        }
        script.src = url;
        body.appendChild(script);
 }
 </pre>
5. 其他的dataType 
 	1. xml: responseXML
 	2. textL: responseText
 	3. json: JSON.parse(responseText)
 	4. html: 直接responseTest 有script 再分割，一个个处理
 	5. script: 直接上loadJS 函数
 	<pre>
 	function loadJS(data){
 	   var doc = document, script =   document.createElement('script'), body = doc.body;
        script.type = 'text/ja**vascript';
        script.text = data;
        body.append(script);
 	}
 	</pre> 

 	

  
 
**