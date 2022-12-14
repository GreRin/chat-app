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

document.getElementById('send-location').addEventListener('click', (event) => {
  // if (navigator.geolocation) {
  //   return alert('Geolocation is not supported by your browser')
  // }

  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  })
})
