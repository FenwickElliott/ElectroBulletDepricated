const https = require("https");
const fs = require("fs");
const path = require('path');
const secrets = require('./secrets')

// let options = {
//     hostname: 'api.pushbullet.com',
//     method: 'GET'
// }

console.log(__dirname)

function get(path, target){
    console.log('getting')
    options['path'] = path;
    // console.dir(JSON.stringify(options))
    let temp = ''
    let req = https.request(options, (res) => {
        console.log('reqesting')
        res.on('data', (d) => {
            console.log('receiving data')
            temp += d;
        });
        res.on('end', function(){
            console.log('writing');
            console.log(path.join(__dirname, `/db/${target}.json`))
            // fs.writeFile(`./db/${target}.json`, temp, (err) => {
                fs.writeFile( path.join(__dirname, `/db/${target}.json`), temp, (err) => {
                if (err) throw err;
            })
        });
        res.on('error', function(e){
            console.log(e);
        });
    });
    req.end();
}


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
            fs.writeFile('./db/devices.json', devices)
            devices = JSON.parse(devices)
            devices.devices.forEach(function(e){
                if (e.has_sms) {
                    box.deviceIden = e.iden
                }
            })
        })
    })
    reqq.end();
    fs.writeFile(path.join(__dirname, '/db/keys.json'), JSON.stringify(box),(err) =>{
        throw err
    })
}


function initialize(key){
    // alert(key)
    options['headers'] = {"Access-Token": key}
    get('/v2/users/me', 'user_info');
    get('/v2/devices', 'devices');
}