'use strict'
var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    port = process.env.PORT || 3000,
    publicDir = `${__dirname}/public`

http.listen(port, () => {
    console.log('Iniciando Express y Socket.IO en localhost:%d', port)
})

// Habilitar la carpeta public
app.use(express.static(publicDir))

app
    .get('/client', (req, res) => {
        res.sendFile(`${publicDir}/client.html`)
    })
    .get('/streaming', (req, res) => {
        res.sendFile(`${publicDir}/server.html`)
    })
    .get('/user', (req, res) => {
        res.sendFile(`${publicDir}/index.html`)
    })

io.on('connection', (socket) => {
    socket.on('streaming', (image) => {
        io.emit('play stream', image)
            //console.log(image)
    })

    socket.on('audio', (audio) => {
        io.emit('audio', audio)
        console.log(audio)
    })
})