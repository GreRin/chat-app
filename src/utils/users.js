let users = []

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsersRoom = (room) => {
  return users.filter((user) => user.room === room)
}

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  //  Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are reqired'
    }
  }

  //  Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  //  Validate a username
  if (existingUser) {
    return {
      error: 'Username in use!'
    }
  }

  //  Store user
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  users = users.filter((user) => user.id !== id)
  return users
}

module.exports = { addUser, getUser, getUsersRoom, removeUser }
