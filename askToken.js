const https = require("https");
const fs = require('fs');
// const data = require('./data');

let options = {
    hostname: 'api.pushbullet.com',
    method: 'GET'
}

function get(path, target){
    // data[path] = target
    console.log('getting')
    options['path'] = path;
    let temp = ''
    let req = https.request(options, (res) => {
        console.log('reqesting')
        res.on('data', (d) => {
            temp += d;
        });
        res.on('end', function(){
            console.log('here');
            fs.writeFile(`./db/${target}.json`, temp, (err) => {
                if (err) throw err;
            })
            data[target] = temp;
        return temp;
        });
        res.on('error', (e) => {
            console.log(e);
        });
    });
    return temp;
    req.end();
}

function initialize(key){
    // data['apiKey'] = key;
    options['headers'] = {"Access-Token": key}
    get('/v2/users/me', 'user_info');
    // get('/v2/devices', 'devices');
}

initialize("o.6548Yicw3tRNDI5CKfax6F2JSSck5HY6")