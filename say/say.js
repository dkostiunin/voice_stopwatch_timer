import express from 'express';import {default as http_base} from 'http';import {default as io_base} from 'socket.io';import path from 'path';
const app=express(),http=http_base.createServer(app),io=io_base(http),__dirname = path.resolve();
app.use(express.static(".")); app.get('/', (req, res) => {res.sendFile (__dirname + '/voice/voice_recognition.html' )})

io.on('connection', (socket) => {
	io.to(socket.id).emit('chat',['подключился',socket.id]); console.log ('yes conns', socket.id);	
	
	socket.on ('disconnect', function(data){console.log (socket.id, 'conns fail')})
	
	
	socket.on('chat',(msg)=>{console.log(11,msg)
	})	
})

http.listen(3000, () => {console.log('listening on *:3000')})

