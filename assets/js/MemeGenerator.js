'use strict';

const RECENT_MEMES_KEY = 'RECENTS-MEMES';

class MemeGenerator {

    constructor(_canvas) {
        this.actualMeme = new Meme();
        this.canvas = _canvas;
        this.context = this.canvas.getContext("2d");
        this._recents = [];
        this.loadFromStorage();
    }

    get recents() {
        return this._recents;
    }

    loadMeme(meme) {
        this.actualMeme = meme;
        this.drawMeme();
    }

    drawMeme() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.actualMeme.image) {
            this.context.drawImage(this.actualMeme.image, 0, 0, this.actualMeme.image.width, this.actualMeme.image.height, 0, 0, this.canvas.width, this.canvas.height);
        }
        if (this.actualMeme.topLineText)
            this.drawText(this.actualMeme.topLineText, this.canvas.width / 2, 50)

        if (this.actualMeme.bottomLineText)
            this.drawText(this.actualMeme.bottomLineText, this.canvas.width / 2, this.canvas.width - 10)

    }

    updateImage(image) {
        this.actualMeme.image = image;
        this.drawMeme();
    }

    updateTopLineText(topLineText) {
        this.actualMeme.topLineText = topLineText;
        this.drawMeme();
    }

    updateBottomLineText(bottomLineText) {
        this.actualMeme.bottomLineText = bottomLineText;
        this.drawMeme();
    }

    drawText(text, x, y) {
        this.context.font = '36pt Impact';
        this.context.textAlign = 'center';

        this.context.fillStyle = 'white';
        this.context.fillText(text, x, y);

        this.context.strokeStyle = 'black';
        this.context.lineWidth = 3;
        this.context.strokeText(text, x, y);
    }

    clear() {
        this.actualMeme = new Meme();
        this.drawMeme();
    }

    saveFile() {
        if (this.actualMeme) {
            let meme;
            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for EDGE and IE
                meme = this.canvas.msToBlob()
                window.navigator.msSaveOrOpenBlob(meme);
            } else {
                meme = this.canvas.toDataURL()
                window.open(meme);
            }
            let previousIndex = this.findIndexFor(this.actualMeme.id)
            if (previousIndex >= 0) {
                this._recents[previousIndex] = this.actualMeme;
            } else {
                this._recents.push(this.actualMeme);
            }
            this.saveToLocalStorage();
        }
    }

    loadFromStorage() {
        let recentsMemes = JSON.parse(localStorage.getItem(RECENT_MEMES_KEY));
        if (recentsMemes) {
            for (let memeJson of recentsMemes) {
                this._recents.push(JSON.parse(memeJson, Meme.parser));
            }
        }
    }

    updateLocalStorage() {
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem(RECENT_MEMES_KEY, JSON.stringify(this._recents));
    }

    findIndexFor(id) {
        let previousIndex = this._recents.findIndex(recent => {
            return recent.id === id;
        });
    }

    removeFromStorage(id) {
        let previousIndex = this.findIndexFor(id)
        if (previousIndex >= 0) {
            this._recents.splice(previousIndex, 1);
        }
    }

    clearStorage() {
        localStorage.clear();
    }
};