// Initialize variables
var topics = ["Harry Potter", "Hermione Granger", "Ronald Weasley", "Rubeus Hagrid", "Albus Dumbledore"];
var userInput;
var btnDisplay = $("#potterBtnDisplay");
var newPotterBtn = $("<button>");
var characterCount = 0;
// Function to create new buttons with parameters "name" and "count"
function newBtn(name, count) {
    var newDisplayBtn = $("<button>");
    newDisplayBtn.append("" + name)
        .addClass("btn btn-outline-dark btn-sm gifBtn")
        .attr("data-character", name)
        .attr("id", "item-" + count);
    // Append those new buttons to the button display section of HTML
    btnDisplay.append(newDisplayBtn);
    characterCount++;
};
// Function to create new buttons for the characters pre-defined in the 'topics' array
function initialDisplay() {
    for(var i=0; i<topics.length; i++) {
        newBtn(topics[i], characterCount);
    };
};
// On click of 'submit' button
$("#submitBtn").on("click", function(event) {
    event.preventDefault();
    // Capture the value of the user's character input
    userInput = $("#userCharacterInput").val()
    // create new buttons from the search - *this could probably be replaced with a method*
    newPotterBtn = $("<button>")
        .attr("data-character", userInput)
        .addClass("btn btn-outline-dark btn-sm gifBtn")
        .attr("id", "item-" + characterCount)
        .append(userInput);
    // Append the new buttons to the button display in the HTML
    btnDisplay.append(newPotterBtn);
    $("#userCharacterInput").val("");
    // Push the user character search to the 'topics' array
    topics.push(userInput);
    // Increase the character count
    characterCount++;
});
// Click listener for each gifBtn
$(document).on("click", ".gifBtn", function() {
    // Reset the gif display
    $("#potterGifs").html("");
    // Declare charaacter as the data-character attribut on the button
    var character = $(this).attr("data-character");
    // Query the API for 50 gifs inluding the character search 
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      character + "&api_key=dc6zaTOxFJmzC&limit=50";

    $.ajax({
      url: queryURL,
      method: "GET"
    })
    .then(function(response) {
        var results = response.data;
        console.log(results);
        // Loop through 10 times
        for (var i = 0; i < 10; i++) {
          var gifDiv = $("<div class='card'>");
          var rating = results[i].rating;
          var title = results[i].title.toUpperCase();
          var source = results[i].source_tld;

            // Only populate gifs if they are *not* R rated
            if(rating !== "r") {
                var div = $("<div class='card-body'>").html("<h5 class='card-title'>" + title + '</h5>');
                var ul = $("<ul class='list-group list-group-flush'>");
                var personImage = $("<img class='card-img-top' alt='Card image cap'>");
                personImage.attr("gif-still", results[i].images.fixed_height_small_still.url);
                personImage.attr("gif-animate", results[i].images.fixed_height_small.url);
                var still = personImage.attr("gif-still");
                var animate = personImage.attr("gif-animate");
                gifDiv.append(ul);
                ul.append("<li class='list-group-item'><strong>Source:</strong> " + source + "<br/>")
                div.append("<h6>Rating: " + rating + "</h6>")
                personImage.attr("src", still);
                gifDiv.prepend(div);
                gifDiv.prepend(personImage);
                $("#potterGifs").prepend(gifDiv);
            };
        };
    });
});
// Run the 'initial display' function
$(document).ready(function() {
    initialDisplay();
});
// Toggle animation on/off
$(document).on('click', 'img', function(event) {
    var animatedSrc = $(event.target).attr('gif-animate')
    var stillSrc = $(event.target).attr('gif-still')
    var currentSrc = $(event.target).attr('src')
    if (currentSrc === stillSrc) {
      $(event.target).attr('src', animatedSrc)
    } else {
      $(event.target).attr('src', stillSrc)
    }
});