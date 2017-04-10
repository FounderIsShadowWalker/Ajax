window.$  = (function(){

    var jsonpNum = 0;

    //序列化参数
    function param(data){
        if(typeof data == "object"){
            var url = "";
            for(var key in data){
                url += key + "=" + data[key] + "&"
            }
            return url;
        }
        else{
            throw  new Error('请以json传递对象');
        }
    }

    function loadJS(url, callback){
        var doc = document, script = document.createElement('script'), body = doc.body;
        script.type = 'text/javascript';
        script.onload = function(){
            // callback && callback();
        }


        script.src = url;
        body.appendChild(script);
    }

    function addJS(text) {
        var doc = document, script = doc.createElement('script'), head = doc.getElementsByTagName('body')[0];
        script.type = 'text/javascript';
        script.text = text;
        body.appendChild(script);
    }
    function ajax(opts) {
        //缺省参数
        var _opts = {
            url: '/',
            type: 'GET',
            dataType: '',
            data: null,
            async: true,
            cache: false,
            timeout: 5,
            load: function () {
            },
            error: function () {
            },
            success: function () {
            },
            complete: function () {
            }
        }, aborted = false, key, xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        for (var key in opts) {
            _opts[key] = opts[key];
        }


        if (_opts.type.toUpperCase() === 'GET') {
            if (param(_opts.data) != "") {
                _opts.url += (_opts.url.indexOf('?') < 0 ? '?' : '&') + param(_opts.data);
            }
            //发送GET 请求时, 可能会得到缓存的结果，所以url加个时间戳
            !_opts.cache && (_opts.url += (_opts.url.indexOf('?') < 0 ? '?' : '&') + "_=" + (+new Date()));
        }

        if (_opts.dataType.toUpperCase() === 'JSONP'){

            if (param(_opts.data) != "") {
                _opts.url += (_opts.url.indexOf('?') < 0 ? '?' : '&') + param(_opts.data);
            }

             _opts.url += "callback=callback" + jsonpNum;

             window["callback" + jsonpNum] = function (para) {
                 _opts.callback(para);
                 window["callback" + jsonpNum] = null;
             }

             jsonpNum ++;
             
             console.log(_opts.url, _opts.callback);



            loadJS(_opts.url, _opts.callback);
        }else{
            function checkTimeout() {
                if (xhr.readyState !== 4) {
                    aborted = true;
                    xhr.abort();
                }
            }

            setTimeout(checkTimeout, _opts.timeout * 1000);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4)    _opts.load && _opts.load(xhr);
                if (xhr.readyState === 4) {
                    var s = xhr.status, xhrdata;
                    if (!aborted && ((s >= 200 && s < 300) || s == 304)) {
                        switch (_opts.dataType.toLowerCase()) {
                            case "xml":
                                xhrdata = xhr.responseXML;
                                break;
                            case "json":
                                xhrdata = window.JSON && window.JSON.parse ? window.JSON.parse(xhr.responseText) : eval('(' + xhr.responseText + ')');
                                break;
                            case "script":
                                addJS(xhr.responseXML);
                                break;

                            default :
                                xhrdata = xhr.responseText;
                        }
                        _opts.success && _opts.success(xhrdata, xhr);
                    } else {
                        _opts.error && _opts.error(xhr);
                    }
                    _opts.complete && _opts.complete(xhr);
                }
            };

            xhr.open(_opts.type, _opts.url, _opts.async);
            if (_opts.type.toUpperCase() === 'POST') {
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            xhr.send(_opts.type.toUpperCase() === 'GET' ? null : param(_opts.data));

        }
    }
    return {
        ajax: ajax,
    }
})();