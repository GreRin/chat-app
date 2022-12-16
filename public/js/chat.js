const socket = io()

// Elements
const $messageFrom = document.getElementById('message-form')
const $messageFormInput = $messageFrom.querySelector('input')
const $messageFormButton = $messageFrom.querySelector('button')
const $sendLocationBtn = document.getElementById('send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const  { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscloll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  //  Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  //  Height of messages container
  const containerHeight = $messages.scrollHeight

  //  How far have I scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on('message', (message) => {
  if (message) {
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscloll()
  }
})

socket.on('locationMessage', (data) => {
  const link = Mustache.render(locationTemplate, {
    username: data.username,
    url: data.url,
    createdAt: moment(data.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', link)
  autoscloll()
})

socket.on('roomData', ({ room, users }) => {
  if (room && users) {
    const html = Mustache.render(sidebarTemplate, {
      room,
      users,
    })
    document.querySelector('#sidebar').innerHTML = html
  }
})

$messageFrom.addEventListener('submit', (event) => {
  event.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')

  const val = event.target.elements.message.value

  socket.emit('sendMessage', val, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

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

socket.emit('join',{ username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
