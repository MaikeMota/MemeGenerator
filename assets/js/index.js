// Get Canvas2DContext
let canvas;
let memeGenerator;
let topLineText = bottomLineText;

jQuery(document).ready(() => {
    canvas = document.querySelector('canvas');
    memeGenerator = new MemeGenerator(canvas);
    topLineText = bottomLineText = "";
    bindEvents();
});

function bindEvents() {
    jQuery('.custom-file-input').on('change', function (event) {
        let element = event.currentTarget;
        let fileName = jQuery(element).val();
    });
    jQuery('.custom-file-input').on('change', (event) => {
        let element = event.currentTarget;
        let rawFileName = jQuery(element).val();
        let startIndex = rawFileName.lastIndexOf('\\') + 1;
        let fileName = rawFileName.substring(startIndex, rawFileName.length);
        jQuery(element).next('.form-control-file').addClass("selected").html(fileName);
    });
    jQuery('#topLineText').on('keyup', textChangeListener);
    jQuery('#bottomLineText').on('keyup', textChangeListener);
    jQuery('#file').on('change', handleFileSelect);
    jQuery('#saveBtn').on('click', () => { memeGenerator.saveFile() });
    jQuery('#clearBtn').on('click', clearData);
}

function textChangeListener(event) {
    let id = event.target.id;
    let text = event.target.value;
    if (id == "topLineText") {
        memeGenerator.updateTopLineText(text);
    } else {
        memeGenerator.updateBottomLineText(text);
    }
}

function handleFileSelect(event) {
    let file = event.target.files[0];
    if (!file) {
        clearFileInput();
        return;
    }
    let reader = new FileReader();
    reader.onload = function (fileObject) {
        let data = fileObject.target.result;
        // Create an image object
        let image = new Image();
        image.onload = function () {
            memeGenerator.updateImage(this);
        }
        // Set image data to background image.
        image.src = data;
    };
    reader.readAsDataURL(file)
}

function clearFileInput() {
    let fileInput = jQuery('.custom-file-input');
    fileInput.files = [];
    fileInput.next('.form-control-file').removeClass("selected").html('');
}

function clearData() {
    clearFileInput();
    jQuery('#topLineText').val('');
    jQuery('#bottomLineText').val('');
    memeGenerator.clear();
}