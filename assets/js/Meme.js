'use strict'

class Meme {

    constructor(image, topLineText, bottomLineText) {
        this.id = new Date().getTime();
        this.image = image;
        this.topLineText = topLineText;
        this.bottomLineText = bottomLineText;
    }

    toJSON() {
        return JSON.stringify({
            id: this.id,
            image: this.image.src,
            topLineText: this.topLineText,
            bottomLineText: this.bottomLineText
        });
    }

    static parser(key, value) {
        if (key === 'image') {
            let image = new Image();
            image.src = value;
            return image;
        } else {
            return value;
        }
    }
}