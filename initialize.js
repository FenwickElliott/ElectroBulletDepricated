const https = require("https");
const fs = require("fs");
const path = require('path')

let options = {
    hostname: 'api.pushbullet.com',
    method: 'GET'
}

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

function initialize(key){
    // alert(key)
    options['headers'] = {"Access-Token": key}
    get('/v2/users/me', 'user_info');
    get('/v2/devices', 'devices');
}