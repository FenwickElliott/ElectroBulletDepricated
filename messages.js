const jsonfile = require('jsonfile');
const fetch = require('node-fetch');
const path = require('path')
const keys = JSON.parse(require('electron').remote.getGlobal('keys').toString())

let currentThread;
let m;

getMagazine();

function getMagazine(){
    fetch(`https://api.pushbullet.com/v2/permanents/${keys.deviceIden}_threads`, {
        headers: {"Access-Token": keys.apiKey}
    })
    .then(res => res.json())
    .then(function(res){
        // currentThread = res.threads[0];
        m = res.threads;
        postMagazine(res);
        jsonfile.writeFile(path.join(__dirname, '/db/magazine.json'), res, err => console.log(err));
        // load threads
        res.threads.forEach(function(threadM){
            jsonfile.readFile(path.join(__dirname, `/db/threads/thread${threadM['id']}.json`), (err, threadI) =>{
                if (err){
                    getThread(threadM['id'])
                }
                if (threadM.latest.id != threadI['thread'][0].id){
                    getThread(threadM['id'])
                }
            })
        })
    })
    .catch(function(err){
        // load magazine from disk if it's there
        jsonfile.readFile(path.join(__dirname, "/db/magazine.json"), (err, mag) => {
            if (err){
                alert("I'm sorry but I can't connect to your PushBullet account, there's not much I can do about that so I'm going back to bed.");
                // figure out how to close window
            }
            m = mag.threads;
            postMagazine(mag)
        });
    });
}

function postMagazine(mag){
    // look into forEach with index
    magazine.innerHTML = '';
    for (let i = 0; i < mag.threads.length; i++){
        let shade;
        if ( i % 2 == 0){
            shade = 'light';
        } else {
            shade = 'dark';
        }
        magazine.innerHTML += `
            <div class="${shade}" id="conversation${i}" onclick="loadThread(${mag.threads[i].id})">
                <h2> ${mag.threads[i].recipients[0].name} </h2>
                <p> ${mag.threads[i].latest.body} </p>
            </div>
        `
    }
    if (bulk.innerHTML == ''){
        loadThread(mag.threads[0].id);
    }

}

function loadThread(id){
    currentThread = m.find(x => x.id == id);
    jsonfile.readFile(path.join(__dirname, `/db/threads/thread${id}.json`), (err, thread) =>{
        if (err || currentThread.latest.timestamp != thread.thread[0].timestamp){
            getThread(id);
        }
        postThread(thread);
    })
}

function getThread(id){
    fetch(`https://api.pushbullet.com/v2/permanents/${keys.deviceIden}_thread_${id}`, {
        headers: {"Access-Token": keys.apiKey}
    })
    .then(res => res.json())
    .then(function(json){
        // postThread(json)
        // console.log("writing thread " + id)
        jsonfile.writeFile(path.join(__dirname, `/db/threads/thread${id}.json`), json, err => console.log(err));
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

function send(body){
    packet = JSON.stringify({
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

    fetch("https://api.pushbullet.com/v2/ephemerals", {
        method: 'POST',
        headers: 'Content-Type: application/json',
        headers: {"Access-Token": keys.apiKey},
        body: packet
    })
    .then(res => res.json())
    .catch(err => alert(err));
}