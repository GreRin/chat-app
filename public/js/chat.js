const socket = io()

socket.on('countUpdated', (count) => {
  console.log('The count has been updated!', count)
})

socket.on('message', (message) => {
  console.log('Message sent: ', message)
})

document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const message = event.target.elements.message.value
  socket.emit('sentMessage', message)
})
