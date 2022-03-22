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

function loadPage(filePath, title) {
    const iframe = window.top.document.getElementById("contentIframe");
    iframe.src = filePath;
    insertHTMLContent(window.top.document.getElementById("title"), "<h1 class=text-center>" + title + "</h1>");
    console.log("loaded: " + filePath);
}

function insertHTML(idToGet, text) {
    const tag = document.getElementById(idToGet);
    tag.innerHTML = text;
}
function insertHTMLContent(id, text) {
    id.innerHTML = text;
}

//function to resize the iframe and its wrapper
function resizeIFrame() {
    const iframe = window.top.document.getElementById("contentIframe");
    const wrapper = window.top.document.getElementById("iframeWrapper");
    if (iframe != null && wrapper != null) {
        height = iframe.contentWindow.document.body.scrollHeight + "px";
        iframe.style.height = height;
        wrapper.style.paddingTop = height;
    }
}

window.addEventListener("resize", resizeIFrame);

function search() {
    const searchField = document.getElementsByClassName("searchBar");
    for (var i = 0; i < searchField.length; i++) {
        var val = searchField[i].value;
        if (val != "" && val != undefined && val != null) {
            val = val.toLowerCase();
            jQuery
                .ajax({
                    type: "POST",
                    url: "/php/request.php",
                    data: { function: "getResults", request: val },
                    dataType: "json",
                    success: function (obj) {
                        if (!("error" in obj)) {
                            var results = obj.result;
                        } else {
                            console.log(obj.error);
                        }
                        //display the list of results
                        const resultDisplays = document.getElementsByClassName("searchResults");
                        var html = "<ul class='vertical menu'>";
                        if (results.length === 0) {
                            html = "<p class = 'text-center'>No Results :/</p>";
                        } else {
                            for (var j = 0; j < results.length; j++) {
                                var onclick = "onclick=\x22loadPage(" + "getNewsPage(" + results[j].id + "), '" + results[j].title + "'); clearSearch();\x22";
                                html += "\n<li class = 'text-center'><a href = '#'" + onclick + ">" + results[j].title + "</a></li>";
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
    for (var resultDisplay of resultDisplays) {
        resultDisplay.style.display = "none";
    }
}

//function to reveal the visibility of the search result box
function revealSearchResults() {
    const resultDisplays = document.getElementsByClassName("searchResults");
    for (var resultDisplay of resultDisplays) {
        resultDisplay.style.display = "block";
    }
}

//function to clear the searches
function clearSearch() {
    const resultDisplays = document.getElementsByClassName("searchResults");
    for (var resultDisplay of resultDisplays) {
        resultDisplay.innerHTML = "";
    }
    const searchField = document.getElementsByClassName("searchBar");
    for (var searchBar of searchField) {
        searchBar.value = "";
    }
}

window.addEventListener("resize", clearSearch);

//function to get the content of a news articles page save it
function getNewsPage(id) {
    var path = "/pages/news/article.html";
    jQuery
        .ajax({
            type: "POST",
            url: "/php/request.php",
            data: { function: "getArticleContent", request: id },
            dataType: "json",
            success: function (obj) {
                if (!("error" in obj)) {
                    var result = obj.result;
                } else {
                    console.log(obj.error);
                }
                window.localStorage.setItem("newsContent", result.content.replace(/\n/g, "<br />"));
            },
        })
        .fail(function (textStatus, errorThrown) {
            console.log("STATUS: " + textStatus + " ERROR: " + errorThrown);
        });
    return path;
}

//function to load the article content
function getCurrentNewsArticle() {
    const articlePage = document.getElementById("articleContent");
    articlePage.innerHTML = window.localStorage.getItem("newsContent");
}

//function to load the list of news into the news list page
function loadNewsList() {
    jQuery
        .ajax({
            type: "POST",
            url: "/php/request.php",
            data: { function: "getNews" },
            dataType: "json",
            success: function (obj) {
                if (!("error" in obj)) {
                    var results = obj.result;
                } else {
                    console.log(obj.error);
                }
                const newsList = document.getElementsByClassName("grid-container newsList");
                var listHTML = "";
                for (var news of results) {
                    listHTML +=
                        "<div class = \x22cell\x22 onmouseover = \x22this.style.borderBottom = '5px dotted rgb(58, 58, 58)'\x22 onmouseout = \x22this.style.borderBottom = '5px dotted rgba(255, 255, 255, 0)'\x22 style = \x22background-color: rgba(224, 224, 224, 0.548); border-radius: 10px; color: black !important; border-bottom: 5px dotted rgba(255, 255, 255, 0)!important;\x22>\n" +
                        "<a href = \x22#\x22 onclick = \x22getNewsPage('" +
                        news.id +
                        "'); loadPage('/pages/news/article.html', '" +
                        news.title +
                        "');\x22>\n<div style = 'padding-left: 10px;'>" +
                        "<h5>" +
                        news.title +
                        "</h5><p style = \x22font-size: 12px\x22>" +
                        news.date +
                        "</p>" +
                        "<p style = 'padding-top: 10px;'>" +
                        news.desc +
                        "</p>" +
                        "</div></a>\n" +
                        "</div>\n<br />";
                }
                var HTML = "<div class = \x22grid-y align-center grid-margin-y\x22>\n" + listHTML + "</div>";
                newsList[0].innerHTML = HTML;
            },
        })
        .fail(function (textStatus, errorThrown) {
            console.log("STATUS: " + textStatus + " ERROR: " + errorThrown);
        });
}

//TODO
/**
 * rethink the about team member system
 * fix that you cant long click on search results without search results disappearing
 * make it more obvious that you can click the project logo
 * make the font of the nav menu smaller on medium screens
 * make pages load their own titles
 */
