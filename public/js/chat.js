const socket = io()

// Elements
const $messageFrom = document.getElementById('message-form')
const $messageFormInput = $messageFrom.querySelector('input')
const $messageFormButton = $messageFrom.querySelector('button')
const $sendLocationBtn = document.getElementById('send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
  console.log(message)
  if (message) {
    const html = Mustache.render(messageTemplate, {
      message
    })
    console.log(html)
    $messages.insertAdjacentHTML('beforeend', html)
  }
})

$messageFrom.addEventListener('submit', (event) => {
  event.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')

  const val = event.target.elements.message.value

  console.log(val)

  socket.emit('sendMessage', val, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    console.log(error)

    if (error) {
      return console.log(error)
    }

    console.log('Message delivered!')
  })
})

$sendLocationBtn.addEventListener('click', (event) => {
  // if (navigator.geolocation) {
  //   return alert('Geolocation is not supported by your browser')
  // }
  $sendLocationBtn.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (message) => {
      $sendLocationBtn.removeAttribute('disabled')
      console.log(message)
    })
  })
})
