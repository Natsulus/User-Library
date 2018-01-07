// ==UserScript==
// @name         Qidian Helper
// @namespace    https://github.com/Natsulus/
// @version      1.0
// @description  Auto Check-in for Spirit Stones, Auto-Play and Skip Ads, Redirect from RSS Page to Chapter Page (Based on Qidian Adwall Defeater by Nazgand)
// @author       Natsulus
// @match        https://www.webnovel.com/book/*
// @match        https://www.webnovel.com/rssbook/*
// @grant        none
// @homepage     https://github.com/Natsulus/
// ==/UserScript==

function getClosest(elem, selector) {
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
    }
    return null;
}

let playingAd = false;
let lockedQueue = [];
let lockedChapter;

function playAd() {
    if (lockedQueue.length === 0 && !playingAd) return;

    if (!playingAd) {
        playingAd = true;
        lockedChapter = lockedQueue.shift();
    }

    const btnPlay = lockedChapter.querySelector("a.bt._play");
    if (btnPlay !== null) {
        btnPlay.click();
    }

    const btnSkip = lockedChapter.querySelector("a.bt._skip.j_can_skip");
    if (btnSkip !== null) {
        btnSkip.click();
    }

    const divLockVideo = lockedChapter.querySelector('div.lock-video');
    if (divLockVideo === null) {
        playingAd = false;
    }
    setTimeout(playAd, 1000);
}

if (document.location.href.startsWith("https://www.webnovel.com/book/")) {
    let first = document.querySelector(".chapter_content");
    if (first.className && first.className.includes("j_lock_chap")) {
        lockedQueue.push(first);
        playAd();
    } else {
        document.addEventListener("DOMContentLoaded", function() { // if first loaded chapter is not loaded before script is run
            first = document.querySelector(".chapter_content");
            if (first.className && first.className.includes("j_lock_chap")) {
                lockedQueue.push(first);
                playAd();
            }
        });
    }
    document.querySelector(".j_contentWrap").addEventListener("DOMNodeInserted", (e) => {
        if (e.target.className && e.target.className.includes("j_lock_chap")) {
            lockedQueue.push(e.target);
            playAd();
        }
    });
}

if (window.location.href.startsWith("https://www.webnovel.com/rssbook/")) {
    window.location.replace(window.g_data.url);
}

function checkIn() {
    const btnCheckIn = document.querySelector("a.fr.g_bt_checkin.j_check_in");
    if (btnCheckIn === null) return;
    const checkedIn = getClosest(btnCheckIn, "._checked");
    if (checkedIn !== null) return;
    btnCheckIn.click();
    setTimeout(checkIn, 1000);
}

checkIn();
