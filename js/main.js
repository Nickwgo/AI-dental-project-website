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
    console.log("loaded: " + filePath);
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
        if (val != "" && val != undefined && val != null) {
            val = val.toLowerCase();
            jQuery
                .ajax({
                    type: "GET",
                    url: "/php/getPages.php",
                    dataType: "json",
                    success: function (obj) {
                        if (!("error" in obj)) {
                            var files = obj.result;
                        } else {
                            console.log(obj.error);
                        }

                        //compare search query to results
                        var results = new Array();
                        for (const file of files) {
                            //if there is a search result add it to the list
                            if (file.fileName.toLowerCase().includes(val)) {
                                const result = file.fileName.replace(/([A-Z])/g, " $1");
                                const resultName = (result.charAt(0).toUpperCase() + result.slice(1)).trim();
                                var temp = {
                                    displayName: resultName,
                                    file: file.path,
                                };
                                results.push(temp);
                            }
                        }
                        //display the list of results
                        const resultDisplays = document.getElementsByClassName("searchResults");
                        var html = "<ul class='vertical menu'>";
                        if (results.length === 0) {
                            html = "<p class = 'text-center'>No Results :/</p>";
                        } else {
                            for (var j = 0; j < results.length; j++) {
                                var onclick = "onclick=\x22insertContent('" + results[j].file + "'); insertHTMLContent('title', '<h1 class=text-center>" + results[j].displayName + "</h1>'); clearSearch();\x22";
                                html += "\n<li class = 'text-center'><a href = '#'" + onclick + ">" + results[j].displayName + "</a></li>";
                            }
                            html += "\n</ul>";
                        }
                        for (var resultDisply of resultDisplays) {
                            resultDisply.innerHTML = html;
                        }
                    },
                })
                .fail(function (textStatus, errorThrown) {
                    console.log("STATUS: " + textStatus + " ERROR: " + errorThrown);
                });
            break;
        }
    }
}

//function to hide the visibility of the search result box
function hideSearchResults() {
    const resultDisplays = document.getElementsByClassName("searchResults");
    for(var resultDisplay of resultDisplays){
        resultDisplay.style.display = "none";
    }
}

//function to reveal the visibility of the search result box
function revealSearchResults() {
    const resultDisplays = document.getElementsByClassName("searchResults");
    for(var resultDisplay of resultDisplays){
        resultDisplay.style.display = "block";
    }
}

//function to clear the searches
function clearSearch(){
    const resultDisplays = document.getElementsByClassName("searchResults");
    for(var resultDisplay of resultDisplays){
        resultDisplay.innerHTML = "";
    }
    const searchField = document.getElementsByClassName("searchBar");
    for (var searchBar of searchField){
        searchBar.value = "";
    }
}

window.addEventListener("resize", clearSearch);
