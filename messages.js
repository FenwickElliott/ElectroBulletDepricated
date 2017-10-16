const https = require("https");
const fs = require("fs");
const path = require('path');
const keys = JSON.parse(require('electron').remote.getGlobal('keys').toString());

// let k = fs.readFileSync('./db/keys.json', 'utf8',(err, data) =>{
//     if (err) throw err;
//     console.log(data)
// });

// let keys = JSON.parse(k)

let currentThread;
let mag;

getMagazine();

function getMagazine(){
    let options = {
        hostname: 'api.pushbullet.com',
        path: `/v2/permanents/${keys.deviceIden}_threads`,
        headers: {"Access-Token": keys.apiKey}
    }
    mag = ''
    let req = https.get(options, (res) => {
        res.on('data', (d) => {
            mag += d;
        })
        res.on('end', () => {
            fs.writeFile(path.join(__dirname, '/db/magazine.json'), JSON.stringify(mag))
        })
    req.on('error', (e)=> {
        console.log(e)
    })
    req.end();
    })
}