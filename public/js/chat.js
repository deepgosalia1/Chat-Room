const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessage = document.querySelector('#location-message-template').innerHTML
const sidebar = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $newmessage = $messages.lastElementChild
    const newMessageHeight = $newmessage.offsetHeight + parseInt(getComputedStyle($newmessage).marginBottom)
    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', message => {
    console.log(message.text);
    const html = Mustache.render(messageTemplate, { username: message.username, message: message.text, createdAt: moment(message.createdAt).format('hh:mm') });
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', message => {
    console.log(message.url);
    const html = Mustache.render(locationMessage, { username: message.username, url: message.url, createdAt: moment(message.createdAt).format('hh:mm') });
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('message', message, (text) => {
        console.log(text)
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    })
})

$locationButton.addEventListener('click', (e) => {
    e.preventDefault();
    $locationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) { return alert('Not possible on this browser!') }
    let message;
    navigator.geolocation.getCurrentPosition((position) => {
        message = { 'lat': position.coords.latitude, 'long': position.coords.longitude }
        socket.emit('location', message, (text) => {
            console.log(text);
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebar, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html
})