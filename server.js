var http = require('http');
var url = require('url');

http.createServer(function(req, res){
    var arg = url.parse(req.url, true).query;
    console.log(arg.callback);


    res.writeHeader(200, {'Content-type': 'text/html','Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
        'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
    });

    var data = {'name': 'founder'};
    var str = arg.callback + '(' + JSON.stringify(data) + ')';

    //res.end(str);
    res.end(str);
    //res.end("\"founder()\"");

}).listen(3000);