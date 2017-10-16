const https = require("https");
const fs = require("fs");
const path = require('path');
const app = require('electron').remote.app

function init(key){
    box = {
        apiKey: key
    }
    let options = {
        hostname: 'api.pushbullet.com',
        method: 'GET',
        path: '/v2/users/me',
        headers: {"Access-Token": key}
    }
    let me = ''
    let req = https.request(options, (res) =>{
        res.on('data', (data) => {
            me += data
        })
        res.on('end', () => {
            box.iden = JSON.parse(me).iden
        })
        res.on('error', (e) => {throw e})
    })
    req.end();
    options.path = '/v2/devices'
    let devices = ''
    let reqq = https.request(options, (res) =>{
        res.on('data', (data) => {
            devices += data
        })
        res.on('end', () =>{
            devices = JSON.parse(devices)
            devices.devices.forEach(function(e){
                if (e.has_sms) {
                    box.deviceIden = e.iden
                }
            })
        })
    })
    reqq.end();
    setTimeout(function(){
        fs.writeFile(path.join(__dirname, '/db/keys.json'), JSON.stringify(box),(err) =>{
            if (err) throw err
            app.relaunch();
            app.exit();
        })
    }, 2000)
}