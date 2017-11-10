# ElectroBullet

ElectroBullet is a desktop client for PushBullet, which allows users to send and recive text messages from their desktop.

A packaged version for mac can be found [here](https://fenwickelliott.io/Assets/software/ElectroBullet.zip).

## To compile yourself
* Clone this reop: `git clone https://github.com/FenwickElliott/ElectroBullet.git`
* Change into the root directory: `cd ElectroBullet`
* Install electron if you haven't already: `npm install electron`
* Start it up: `electron .`

## To package yourself
Currently the only packaging script included is for Mac, I will set up Windows and Linux in due course.
* Clone this repo: `git clone https://github.com/FenwickElliott/ElectroBullet.git`
* Change into the root directory: `cd ElectroBullet`
* Install electron-packager if you haven't already: `npm install electron-packager`
* Package it: `npm run package-mac`
* You will find the packaged app in ./release-builds/ElectroBullet-darwin-x64