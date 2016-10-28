var http = require('http');

http.createServer(function(req, res){
    var chunk = '';
    req.on('data', function(data){
         chunk += data;
    })

    req.on('end', function(){
        console.log(chunk);
    })
    res.writeHeader(200, {'Content-type': 'text/html','Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
        'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS'
    });

    var data = {'name': 'founder'};
    var str = '$.founder' + '(' + JSON.stringify(data) + ')';

    //res.end(str);
    res.end(str);
    //res.end("\"founder()\"");

}).listen(3000);