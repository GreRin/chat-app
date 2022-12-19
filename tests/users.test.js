const { addUser, getUser, getUsersRoom, removeUser } = require('../src/utils/users')
const { user, users } = require("./fixtures/db");

test('Should add user', () => {
  const item = addUser(user)
  expect(item.user).toEqual(user)
});

test('Should fire error - Username in use!', () => {
  users.forEach(item => addUser(item))
  const exactuser = addUser(  {
    id: '1',
    username: 'greg',
    room: 'js'
  })
  expect(exactuser.error).toEqual('Username in use!')
})

test('Should return user', () => {
  addUser(user)
  const exactuser = getUser('4')
  expect(exactuser).toEqual(user)
})

test('Should should get user room', () => {
  users.forEach(item => addUser(item))
  const rooms = getUsersRoom('js')
  expect(rooms.length).toBeTruthy()
})

test('Should delete user', () => {
  users.forEach(item => addUser(item))
  const rooms = removeUser('2')
  expect(rooms.length).toBe(2)
})
