const express  = require('express')
const app = express()
const socketio = require('socket.io')
const http = require('http')
const {v4:uuidv4} = require('uuid')
const { ExpressPeerServer } = require('peer')

const server = http.Server(app)
const peerServer = ExpressPeerServer(server,{
    debug:true
})

app.set('view engine','ejs')
app.use(express.static('public'))
app.use('/peerjs',peerServer)
app.get('/',(req,res,next)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:roomId',(req,res,next)=>{
    res.render('room',{roomId:req.params.roomId})
})

const io = socketio(server)

io.on('connection',(socket)=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).emit('user-connected',userId)
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)

        })
    })
})

server.listen(3000) 