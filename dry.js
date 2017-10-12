const fs = require('fs')

if (fs.existsSync('./db/user_info.json')){
    console.log('yes')
} else {
    console.log('no')
}