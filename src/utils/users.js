const users = []

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room) {
        return {
            error:'Both, Username and Room name is required.'
        }
    }

    // check for existing username in the given room
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    if (existingUser) {
        return{
            error:'Username is in use!'
        }
    }

    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const ind = users.findIndex(user=>user.id === id);
    if (ind!==-1){
        return users.splice(ind,1)[0]
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUserInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {addUser, removeUser, getUser, getUserInRoom}