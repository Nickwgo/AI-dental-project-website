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
function overwritePage(path) {
    document.close();
    fetch(path)
        .then((response) => response.text())
        .then((text) => document.write(text));
}

//function to find and display search results
function search() {
    const searchField = document.getElementsByClassName("searchBar");
    for (var i = 0; i < searchField.length; i++) {
        var val = searchField[i].value;
        if ((val != "") && (val != undefined)) {
            val = val.toLowerCase();
            jQuery
                .ajax({
                    type: "GET",
                    url: "/php/getPages.php",
                    dataType: "json",
                    success: function (obj) {
                        console.log("success");
                        if (!("error" in obj)) {
                            var files = obj.result;
                        } else {
                            console.log(obj.error);
                        }

                        //compare search query to results
                        console.log("search: " + val);
                        for (const file of files) {
                            if (file.toLowerCase().includes(val)) {
                                const result = file.replace(/([A-Z])/g, " $1");
                                const resultName = (result.charAt(0).toUpperCase() + result.slice(1)).trim();
                                console.log(resultName);
                            }
                        }


                    },
                })
                .fail(function (textStatus, errorThrown) {
                    console.log("STATUS: " + textStatus + " ERROR: " + errorThrown);
                });
        }
    }

}