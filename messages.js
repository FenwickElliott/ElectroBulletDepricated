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
    let m = ''
    let req = https.get(options, (res) => {
        res.on('data', (d) => {
            m += d;
        })
        res.on('end', () => {
            mag = JSON.parse(m)
            postMagazine(mag)
            fs.writeFile(path.join(__dirname, '/db/magazine.json'), m)
        })
    req.on('error', (e)=> {
        console.log(e)
    })
    req.end();
    })
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
    // if (bulk.innerHTML == ''){
    //     loadThread(mag.threads[0].id);
    // }
}
