const https = require("https");
const fs = require("fs");
const path = require('path');
const keys = JSON.parse(require('electron').remote.getGlobal('keys').toString());

let currentThread;
let mag;

let options = {
    hostname: 'api.pushbullet.com',
    headers: {"Access-Token": keys.apiKey}
}

getMagazine();

function getMagazine(){
    options.path = `/v2/permanents/${keys.deviceIden}_threads`
    let m = ''
    let req = https.get(options, (res) => {
        res.on('data', (d) => {
            m += d;
        })
        res.on('end', () => {
            mag = JSON.parse(m).threads
            postMagazine(mag)
            fs.writeFile(path.join(__dirname, '/db/magazine.json'), m)
        })
    req.on('error', (e)=> {
        console.log(e)
    })
    req.end();
    })
}

function postMagazine(){
    // look into forEach with index
    magazine.innerHTML = '';
    for (let i = 0; i < mag.length; i++){
        let shade;
        if ( i % 2 == 0){
            shade = 'light';
        } else {
            shade = 'dark';
        }
        magazine.innerHTML += `
            <div class="${shade}" id="conversation${i}" onclick="loadThread(${mag[i].id})">
                <h2> ${mag[i].recipients[0].name} </h2>
                <p> ${mag[i].latest.body} </p>
            </div>
        `
    }
    if (bulk.innerHTML == ''){
        loadThread(mag[0].id);
    }
}

function loadThread(id){
    currentThread = mag.find(x => x.id == id);
    fs.readFile(path.join(__dirname, `/db/threads/thread${id}.json`), 'utf8', (err, data) => {
        if (err || currentThread.latest.timestamp != JSON.parse(data).thread[0].timestamp){
            getThread(id)
        }
        postThread(JSON.parse(data))
    })
}

function getThread(id){
    options.path = `/v2/permanents/${keys.deviceIden}_thread_${id}`
    let t = ''
    let req = https.get(options, (res) => {
        res.on('data',(d) =>{
            t += d;
        })
        res.on('end', () =>{
            postThread(JSON.parse(t))
            fs.writeFile(path.join(__dirname, `/db/threads/thread${id}.json`), t)
        })
    req.end();
    })
}

function postThread(thread){
    bulk.innerHTML = '';
    thread.thread.forEach(function(msg){
        bulk.innerHTML = `<p class="${msg.direction}">${msg.body}</p>` + bulk.innerHTML
        // bulk.innerHTML += `<p class="${msg.direction}">${msg.body}</p>`;
    })
    bulk.scrollTop = bulk.scrollHeight;
}

let sendOptions = {
    hostname: 'api.pushbullet.com',
    path: '/v2/ephemerals',
    method: 'POST',
    headers: {
        'Access-Token': keys.apiKey,
        'Content-Type': 'application/json'
    }
};

function send(body) {
    let payload = JSON.stringify({
        push: {
                conversation_iden: currentThread.recipients[0].address,
                message: body,
                package_name: "com.pushbullet.android",
                source_user_iden: keys.iden,
                target_device_iden: keys.deviceIden,
                type: "messaging_extension_reply"
            },
        type: "push"
    })
    let req = https.request(sendOptions, (res) => {
        alert(res.statusCode)
        res.on('data', (d) =>{
            process.stdout.write(d)
        })
    })
    req.on('error', (e) =>{
        console.log(e)
    })
    req.write(payload);

    req.end();
    return false
}

const websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + keys.apiKey);
websocket.onmessage = function(e){
    // console.dir(e.data);
    let data = JSON.parse(e.data);
    if (data.push && data.push.notifications) {
        getMagazine();
        data.push.notifications.forEach(function(n){
            new Notification(data.push.notifications[0].title, {
                body: data.push.notifications[0].body
            })
        })
    }
}