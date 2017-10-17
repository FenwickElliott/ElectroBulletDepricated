# ElectroBullet

ElectroBullet is a desktop client for PushBullet, which allows users to send and recive text messages from their desktop.

A packaged version can be found [here](http://aws-website-fenwickelliott-9evp8.s3-website-us-east-1.amazonaws.com/ElectroBullet.html).

To package it yourself clone this repo and issue `electron .`

## To compile yourself
* Install electron if you haven't already: `npm install electron`
* Issue the the bash command `electron .` from the root directory.

## To package yourself
Currently the only packaging script included is for Mac, I will set up Windows and Linux in due course.
* install electron-packager if you haven't already `npm install electron-packager`
* Issue the the bash command `npm run package-mac` from the root directory.