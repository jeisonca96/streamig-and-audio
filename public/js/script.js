'use strict'

var io = io()

io.on('connect', function (audioRec) {
    console.log("Conectado al servidor");
})

let log = console.log.bind(console),
    id = val => document.getElementById(val),
    ul = id('ul'),
    ull = id('ull'),
    gUMbtn = id('gUMbtn'),
    start = id('start'),
    stop = id('stop'),
    stream,
    recorder,
    counter = 1,
    chunks,
    media;


gUMbtn.onclick = e => {
    let mv = id('mediaVideo'),
        au = id('mediaAudio'),
        mediaOptions = {
            video: {
                tag: 'video',
                type: 'video/webm',
                ext: '.mp4',
                gUM: { video: true, audio: true }
            },
            audio: {
                tag: 'audio',
                type: 'audio/ogg',
                ext: '.ogg',
                gUM: { audio: true }
            }
        };

    if (au.checked) {
        media = mediaOptions.audio
    } else {
        media = mediaOptions.video
    }

    navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
        stream = _stream;
        id('gUMArea').style.display = 'none';
        id('btns').style.display = 'inherit';
        start.removeAttribute('disabled');
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            chunks.push(e.data);
            if (recorder.state == 'inactive') makeLink();
        };
        log('got media successfully');
    }).catch(log);
}

start.onclick = e => {
    start.disabled = true;
    stop.removeAttribute('disabled');
    chunks = [];
    recorder.start();
}


stop.onclick = e => {
    stop.disabled = true;
    recorder.stop();
    start.removeAttribute('disabled');
}



function makeLink() {
    let blob = new Blob(chunks, { type: media.type }),
        url = URL.createObjectURL(blob),
        li = document.createElement('li'),
        mt = document.createElement(media.tag),
        hf = document.createElement('a'),
        bt = document.createElement('button')

    bt.setAttribute('class', "btn btn-default")
    bt.setAttribute('id', "send")
    bt.setAttribute('onclick', "send()")
    bt.innerHTML = "Send"

    mt.controls = true;
    mt.src = url;
    hf.href = url;
    hf.download = `${counter++}${media.ext}`;
    hf.innerHTML = `Descargar ${hf.download}`;
    li.appendChild(mt);
    // li.appendChild(hf);
    li.appendChild(bt);
    ul.appendChild(li);
}

io.on('audio', function (audioRec) {
    chunks = audioRec
    console.log("dos", chunks);
    addAudioON(chunks)
})

function addAudioON(chunks) {
    let blob = new Blob(chunks, { type: "audio/ogg" }),
        url = URL.createObjectURL(blob),
        mt = document.createElement("audio")

    mt.controls = true;
    mt.src = url;

    ull.appendChild(mt)
}

function send() {
    console.log("uno", chunks);
    io.emit('audio', chunks)
}