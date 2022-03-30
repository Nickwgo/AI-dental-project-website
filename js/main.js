$(document).foundation();
$(function () {
    //set the height of the nav bar
    setProjectLogoCell();
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

//function to load a page
function loadPage(filePath, title = "", subtitle = "") {
    const iframe = window.top.document.getElementById("contentIframe");
    iframe.src = filePath;
    if (title !== "" || subtitle !== "") {
        loadTitle(title, subtitle);
    }
}

//function to load the title
function loadTitle(title, subtitle = "") {
    insertContent(window.top.document.getElementById("title"), title);
    insertContent(window.top.document.getElementById("subtitle"), subtitle);
}

//function to insert html
function insertContent(elem, text, isHTML = false) {
    if (typeof elem == "object") {
        if (isHTML == true) {
            elem.innerHTML = text;
        } else {
            elem.innerText = text;
        }
    } else {
        const tag = document.getElementById(elem);
        if (isHTML == true) {
            tag.innerHTML = text;
        } else {
            tag.innerText = text;
        }
    }
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

//function to set the hight of the cell for projectLogo
function setProjectLogoCell() {
    const cell = document.getElementById("projectLogoCell");
    const logos = document.getElementsByClassName("projectLogo");
    if (cell != null && logos != null) {
        var height;
        var width;
        for (var logo of logos) {
            if (window.getComputedStyle(logo).display != "none") {
                height = logo.height;
                width = logo.width + 10;
            }
        }
        cell.setAttribute("style", "height: " + height + "px!important; " + "width: " + width + "px!important;");
    }
}

window.addEventListener("resize", setProjectLogoCell);

//function to resize an element
function resizeElem(elem, newWidth) {
    elem.width = newWidth;
}

//function to load the page of team members
function loadTeamMembers() {
    jQuery
        .ajax({
            type: "POST",
            url: "/php/request.php",
            data: { function: "getTeamMembers" },
            dataType: "json",
            success: function (obj) {
                if (!("error" in obj)) {
                    var results = obj.result;
                } else {
                    console.log(obj.error);
                }
                const memberList = document.getElementsByClassName("grid-container");
                listHTML = "<div class=\x22grid-x align-center grid-margin-x grid-margin-y small-up-1 medium-up-3 large-up-4 image-grid\x22>";
                for (result of results) {
                    picture = result.name.toLowerCase().replace(" ", "");
                    html = "<div class=\x22cell shrink\x22>";
                    html += "<a href=\x22#\x22 onclick=\x22loadPage('/pages/teamMembers/teamMember.html', '" + result.name + "')\x22>";
                    html += "<article class=\x22teamMemberContainer\x22 aria-label=\x22" + result.title + " " + result.name + "\x22>";
                    html += "<img class=\x22teamMemberPhoto\x22 src=\x22/resources/" + picture + ".png\x22 alt=\x22" + result.name + "\x22 />";
                    html += "<div class=\x22info\x22>";
                    html += "<div class=\x22name\x22>" + result.name + "</div>";
                    html += "<div class=\x22profession\x22>" + result.role + "</div>";
                    html += "</div>";
                    html += "</article>";
                    html += "</a>";
                    html += "</div>";
                    listHTML += html;
                }
                listHTML += "</div>";

                memberList[0].innerHTML = listHTML;
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
 * fix that sometimes the news just doesnt appear
 * make it remember the last loaded title
 * change the json stuff t just one file
 */
