$(document).foundation();
$(function () {

    // Selecting the iframe element
    const iframe = document.getElementById("contentIframe");
    const wrapper = document.getElementById("iframeWrapper");
    // Adjusting the iframe height onload event
    if (iframe != null && wrapper != null) {
        iframe.onload = function () {
            height = iframe.contentWindow.document.body.scrollHeight + "px";
            iframe.style.height = height;
            wrapper.style.paddingTop = height;
        };
    }
    $(".search").bind("click", function (event) {
        $(".search-field").toggleClass("expand-search");

        // if the search field is expanded, focus on it
        if ($(".search-field").hasClass("expand-search")) {
            $(".search-field").focus();
        }
    });
});

function insertContent(filePath) {
    const iframe = document.getElementById("contentIframe");
    iframe.src = filePath;
    console.log("done");
}

function insertHTMLContent(idToGet, text) {
    const tag = document.getElementById(idToGet);
    tag.innerHTML = text;
}

//function to resize the iframe and its wrapper
function resizeIFrame() {
    const iframe = document.getElementById("contentIframe");
    const wrapper = document.getElementById("iframeWrapper");
    if (iframe != null && wrapper != null) {
        height = iframe.contentWindow.document.body.scrollHeight + "px";
        iframe.style.height = height;
        wrapper.style.paddingTop = height;
    }
}

window.addEventListener("resize", resizeIFrame);

//function to overwrite the current page with the given html file
function overwritePage(path){
    document.close();
    fetch(path).then(response => response.text()).then(text => document.write(text));
}


