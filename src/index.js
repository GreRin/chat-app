const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage} = require("./utils/messages");
const { getUser, getUsersRoom, addUser, removeUser } = require('./utils/users')

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0;

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))

        //    socket events - socket.emit, io.emit, socket.broadcast.emit
        //    io.to.emit - emit an event to everybody in a specific room
        //    socket.broadcast.to.emit - sending the event to everyone except the specific client, but it's limiting for a specific room
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        // socket.emit('countUpdated', count) // This line emits an event to that specific connection
        io.to('1').emit('message', generateMessage(message)) // Emits the event for every single connection
        callback('Delivered!')
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location shared!')
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
