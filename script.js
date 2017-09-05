var query;
var url;
var notYetChanged = true; // to see if "...or click here.." has been changed
var notFirstSearch = false; // to see if this is the first search made or not
var queryResultTitles, queryResultDescriptions, queryResultLinks;


$(document).ready(function () {
    // get value from input field
    $("#search_input").keypress(function (e) {
        var key = e.which;
        if (key === 13) { // enter key
            query = $("#search_input").val();
            console.log("Query: " + query);
            // push search box to top
            $(".search-container").css({
                "transform": "",
                "margin-bottom": "3rem"
            }).animate({"top" : "7rem"}, 500);
            if (notYetChanged) {
                // remove the "...or" from "...or click here (if it hasnt already been changed"
                $(".random-article p").fadeOut(400, function (){
                    $(this).text("click here for a random article").fadeIn(400);
                });
                notYetChanged = false;
            }
            /* make a Wikipedia request with retrieved value and format
            page appropriately */
            getQueryResults();
        }
    });
});

/* this function queries the mediawiki database for the given input, and renders the
    results on the web page */
function getQueryResults() {
    // set origin to * so that the access-control-allow-origin header will be set
    url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + query
        + "&datatype=json&limit=10&origin=*";

    $.getJSON(url, function(data) {
        // success function
        console.log(data);
        // setting vars
        queryResultTitles = data[1];
        queryResultDescriptions = data[2];
        queryResultLinks = data[3];
        // fadeIn/fadeOut animations
        $("#query_results").fadeOut(200, function() {
            $(this).html("");
            renderResults();
            $(this).fadeIn(200);
        });
    });
    notFirstSearch = true;
}

// this function gets a string as input and returns its truncated version
function truncate(str, len) {
    if (len >= str.length) return str;
    var array = str.split("");
    var newWord = "";
    for (var i = 0; i < len-3; i++) {
        newWord += array[i];
    }
    newWord += "...";
    return newWord;
}

// create a new div for every result and render it on the page
function renderResults () {
    for (var i = 0; i < queryResultTitles.length; i++) {
        // truncate description if it's longer than 230 characters
        var title = queryResultTitles[i];
        var description = truncate(queryResultDescriptions[i], 300);
        var link = queryResultLinks[i];
        if (description.endsWith("may refer to:") || description.endsWith("may refer to :")) description = "Several definitions for " + query;
        var result =
            $("<a class='result-link' href=" + link + " target='_blank'><div class='result-box'>" +
                "<h4 class='result-title'>" + title + "</h4>" +
                "<h5 class='result-description'>" + description + "</h5>" +
                "</div></a>");
        $("#query_results").append(result);
    }
    // hover animations
    $(".result-box").hover(function () {
        // mouse-on function
        $(this).css({
            "background-color": "#767676",
            "border": "3px solid #EEE",
            "opacity": "1"
        });
        $(this).animate({
            "min-height": "7rem",
            "margin-bottom": "0.1rem"
        }, 100);
        $(".result-link").css({"text-decoration": "none"})

    }, function () {
        // mouse-off function, basically revert to the way it was before
        $(this).css({
            "background-color": "inherit",
            "border": "2px solid #95989A",
            "opacity": "0.3"
        });
        $(this).animate({
            "min-height": "6rem",
            "margin-bottom": "1rem"
        }, 100);
    });
    $("footer").css({"display": "inline"})
}

