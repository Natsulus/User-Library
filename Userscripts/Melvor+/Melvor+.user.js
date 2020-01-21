// ==UserScript==
// @name         Melvor+
// @namespace    https://github.com/Natsulus/
// @version      0.1.0
// @description  Adds enhancements, automation, and cheats to Melvor Idle
// @author       Natsulus
// @match        https://melvoridle.com/*
// @resource     icon https://raw.githubusercontent.com/Natsulus/User-Library/master/Userscripts/Melvor%2B/res/icon.svg
// @grant        GM.getResourceUrl
// @homepage     https://github.com/Natsulus/
// ==/UserScript==
'use strict'

let melvorPlus;

class MelvorPlus {
    constructor() {
        console.log(rockData)
    }
}

class MelvorAuto {
    constructor() {
        //
    }
}

class MelvorCheat {
    constructor() {
        //
    }
}

function start(loaded) {
    if (loaded) melvorPlus = new MelvorPlus();
    else setTimeout(start, 1000, document.getElementById("m-page-loader").className == "hide");
}

start(document.getElementById("m-page-loader").className == "hide");