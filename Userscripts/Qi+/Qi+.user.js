// ==UserScript==
// @name         Qi+
// @namespace    https://github.com/Natsulus/
// @version      1.0
// @description  Auto Check-in for Spirit Stones, Auto-Play and Skip Ads, Redirect from RSS Page to Chapter Page (Based on Qidian Adwall Defeater by Nazgand)
// @author       Natsulus
// @match        https://www.webnovel.com/*
// @grant        none
// @homepage     https://github.com/Natsulus/
// ==/UserScript==

class Modal {
    constructor({prefix, modalTrigger, chapter = false}) {
        this.chapter = chapter;
        this.prefix = prefix;
        this.modalTrigger = modalTrigger;
        this.modalTrigger.click(() => {this.open();});
        if (this.chapter) this.chapterModal();
        else this.normalModal();
    }

    normalModal() {
        this.modal = $("<div/>", {
            class: `${this.prefix} modal`
        });
        this.modalHeader = $("<header/>", {
            class: `${this.prefix} modal-header`
        });
        this.headerTitle = $("<h1/>", {
            text: `Qi+ Settings`
        });
        this.modalCloseBtn = $("<div/>", {
            class: `${this.prefix} modal-close-btn`
        });
        this.modalBody = $("<div/>", {
            class: `${this.prefix} modal-body`
        });
        this.modalContent = $("<div/>", {
            class: `${this.prefix} modal-content`,
            text: "HI THERE"
        });
        this.modalFooter = $("<footer/>", {
            class: `${this.prefix} modal-footer`
        });
        $(document.body).append(this.modal.append(this.modalHeader.append(this.headerTitle).append(this.modalCloseBtn)).append(this.modalBody.append(this.modalContent).append(this.modalFooter)));
        this.modalCloseBtn.click(() => {this.close();});
    }

    chapterModal() {
        this.modal = $("<div/>", {
            id: "modalQiPlus",
            class: `${this.prefix} g_mod cha-modal`
        });
        this.headerTitle = $("<h4/>", {
            class: `g_mod_hd`,
            text: "Qi+ Settings"
        });
        this.modalCloseBtn = $("<a/>", {
            class: `${this.prefix} _close`
        });
        this.modalCloseBtn.html(`<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#i-times"></use></svg>`);
        this.modalBody = $("<form/>", {
            class: `${this.prefix} cha-modal-bd theme-set j_theme_setting`
        });
        this.qipToolBtn = $("<a/>", {
            class: `${this.prefix} j_modal j_qip`,
            href: "#modalQiPlus",
            title: "Qi+ Settings",
            text: "Qi+"
        });
        $("#modalTheme").after(this.modal.append(this.modalCloseBtn).append(this.headerTitle).append(this.modalBody));
        $(".cha-tools > .j_theme").after(this.qipToolBtn);

        this.tools = $(".cha-tools").children();
        this.tools.splice(2, 1);

        this.modalCloseBtn.click(() => {this.close(false);});
        this.qipToolBtn.click(() => {
            if (this.modal.hasClass("_on")) {
                this.close(false);
            } else {
                this.open();
                this.tools.removeClass("_on");
                $("#modalCatalog, #modalTheme, #modalReview, #modPowerVote").removeClass("_on");
            }
        });
        this.tools.click(el => { // hacky fix
            if (this.modal.hasClass("_on")) this.close(true);
            if ($("html").hasClass("_sd_on") && !$(el.target.hash).hasClass("_on")) {
                $(el.target.hash).addClass("_on");
            }
        });
    }

    open() {
        if (this.chapter) {
            this.modal.addClass("_on");
            this.qipToolBtn.addClass("_on");
            $("html").addClass("_sd_on");
        } else {
			this.modal.addClass("show");
			this.modal.removeClass("hide");
        }
    }

    close(swap) {
        if (this.chapter) {
            this.modal.removeClass("_on");
            this.qipToolBtn.removeClass("_on");
            if(!swap) $("html").removeClass("_sd_on");
        } else {
			this.modal.addClass("hide");
			this.modal.removeClass("show");
        }
    }
}

let jQCheck = setInterval(function() {
    if (window.jQuery) {
        clearInterval(jQCheck);
        $(document.head).append($("<style>", {
            text: `
.qip.modal {
background: #fff;
box-shadow: 0 4px 16px rgba(0,0,0,.2);
border-left: 1px solid rgba(0,0,0,.333);
width: 400px;
max-width: 400px;
height: 100%;
position: fixed;
right: -400px;
top: 0;
z-index: 55;
}

.qip.modal-body {
overflow-y: auto;
height: calc( 100% - 52px );
}

.qip.modal-header {
transition: border-color 0.2s ease;
box-sizing: border-box;
background-color: #eee;
border-bottom: 1px solid rgba(0,0,0,.2);
font-size: 16px;
height: 70px;
line-height: 30px;
margin: 0;
padding: 9px 0;
vertical-align: middle;
}

.qip.modal-header > h1 {
margin: auto auto;
width: 140px;
font-size: 20px;
line-height: 28px;
font-weight: 500;
letter-spacing: -0.03em;
cursor: default;
padding-top: 10px;
}

.qip.modal-close-btn {
    height: 15px;
    width: 15px;
    position: absolute;
    white-space: nowrap;
    text-align: center;
    top: 5px;
    right: 5px;
}

.qip.modal-close-btn:after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 25px;
    color: black;
    text-align: center;
    content: "\\D7";
    cursor: pointer;
}

.qip.modal-close-btn:hover {
    opacity: 0.6;
}

.qip.j_qip {
    text-align: center;
}

.modal.show {
    transition-duration: 600ms;
    -webkit-transition-duration: 600ms;
    transform: translate(-100%);
    -webkit-transform: translate(-100%);
}

.modal.hide {
    transition-duration: 600ms;
    -webkit-transition-duration: 600ms;
    transform: translate(100%);
    -webkit-transform: translate(100%);
}`
        }));
        QiPlus();
    }
}, 1);

function QiPlus() {
    const config = {
        prefix: "qip",
        chapter: !!$("#page")[0]
    };

    createElements(config);
}

let elements = {};

function createElements(config) {
    config.modalTrigger = $("<li>").append($("<a/>", {
        class: `${config.prefix} modal-trigger`,
        text: "Qi+ Settings"
    }));
    $($(".g_user > ._bd > ul").children()[3]).after(config.modalTrigger);

    let QiPlusModal = new Modal(config);
}

/*
Hide Ads
.g_ad_ph {display: none;}
*/

$("#modalCatalog").prepend()
(`<a href="javascript:;" class="_close"><svg><use xlink:href="#i-times"></use></svg></a>`)

// Give above close button an action to close the modal

onModalCatalogClick() {
		
}