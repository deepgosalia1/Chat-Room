const express = require('express')
const path = require('path')
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users');
// const http = require('http')

const app = express();
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const server = app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})


const io = socketio(server);
io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', generateMessage('System', 'Welcome to the chat room!'));

        socket.broadcast.to(user.room).emit('message', generateMessage('System', `${user.username} has joined the room!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback();
    })

    socket.on('message', (value, callback) => {
        const user = getUser(socket.id);
        if (user === undefined) return;
        io.to(user.room).emit('message', generateMessage(user.username, value));
        callback('Delivered!');
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('System', `${user.username} has left the party`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })

    socket.on('location', (location, callback) => {
        const user = getUser(socket.id);
        if (user === undefined) return;
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.lat},${location.long}`));
        callback('Location Sent!')
    })

})