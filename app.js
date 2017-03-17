var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
    res.sendfile( __dirname + '/index.html');
});

var userIds = [];
function checkAndAdd(id){
    var u = userIds.find(function(i){
        if(i == id){
            return true;
        }
    });
    if(!u){
       userIds.push(id);
    }
}
io.on('connection',function(socket){
    console.log('User Connected');
    //Send a message after a timeout of 4seconds
    /*setTimeout(function(){
        socket.send('Sent a message 4seconds after connection!');
    }, 4000);*/
    socket.on('disconnected',function(){
            console.log('A user disconnected');
        });
    socket.on('start', function(msg){
        userIds.push(msg.id);
        console.log("user id: ",msg.id," saved.");
    });
    socket.on('chat message', function(data){
        console.log('message: ' + data.id +" "+data.message);
        io.emit('chat message', {id:data.id,msg:data.message});
    });
});

http.listen(5000,function(){
    console.log('listening on *.5000');
});
