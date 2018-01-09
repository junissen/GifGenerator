
// API key for GIPHY
var apiKey = "A2ynIYaW5qQib5tp6THFi378VaXaSfs4";

// Topics: 90s TV shows
var topics = ["Hey Arnold", "Rocket Power", 
			"Saved by the Bell", "Fresh Prince of Bel Air",
			"The X Files", "Buffy the Vampire Slayer"];

// 10-item array with 1 values. This to be used to allow for multiple gifs to play at once
var clickAmount = []

for (var i=0; i < 10; i++) {
	clickAmount.push(1)
};

// Function for displaying Gifs when button is pressed. 
function displayGifs() {
	// Empties any previous gifs 
	$('#giphy').empty();
	// Grabs search attribute of button
	var show = this.getAttribute("data-show");
	// Provides query URL using search term and apiKey, at a limit 10 gifs
	var queryURL = "http://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + show + "&limit=10";

	// AJAX request for GIPHY
	$.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {

		var results = response.data;

		for (var i = 0; i < results.length; i ++) {
			// For each gif, creates div, p, and image element. Provides multiple attributes for image element for styling and 
			// displaying motion when prompted. Default source is still image. Adds to HTML page
			var gifDiv = $('<div>');
			var ratingP = $('<p>').text("Rating: " + results[i].rating);
			var showImage = $('<img>');
			showImage.attr('data-still', results[i].images.fixed_height_small_still.url);
			showImage.attr('data-motion', results[i].images.fixed_height_small.url);
			showImage.attr('src', results[i].images.fixed_height_small_still.url);
			showImage.attr('id', 'gifImage');
			showImage.attr('data-number', [i])
			gifDiv.addClass('gifImageDiv')
			gifDiv.prepend(showImage);
			gifDiv.prepend(ratingP);
			$('#giphy').prepend(gifDiv);
		}

	});
};


function renderButtons() {
	// Empties any buttons already on page
	$('#buttons').empty();

	// For each variable in topics array, creates button element. Provides multiple attributes for button element
	// for styling and to provide search terms for GIPHY generation. Adds to HTML page
	for (var i = 0; i < topics.length; i ++) {
		var button = $('<button>');
		button.addClass("show btn btn-light btn-outline-dark");
		button.attr("data-show", topics[i]);
		button.text(topics[i]);
		$('#buttons').append(button)
	}
};

// On submit button to add new shows, adds variable to topics array and runs button generation
$('#add-show').on("click", function() {
	event.preventDefault();

	if ($('#show-input').val()) {
		var newShow = $('#show-input').val().trim();
		topics.push(newShow);
		renderButtons();
		$('#show-input').val("");
	}

	else {
		alert("You did not enter a show to be added")
	}
});

$('#refresh').on("click", function() {
	event.preventDefault();
	$('#giphy').empty();
})

// When show button is clicked, runs displayGifs function 
$(document).on("click", ".show", displayGifs);

// When gif image is clicked, grabs multiple attributes from image element. If the index number of the image in clickAmount array 
// is 1, displays gif in motion and changes value to 2. If value is already 2 (i.e. image is already in motion), displays 
// still gif and changes value to 1.
$(document).on("click", "#gifImage", function() { 
	var clickNumber = this.getAttribute('data-number');
	var motionGif = this.getAttribute('data-motion');
	var stillGif = this.getAttribute('data-still');

	if (clickAmount[clickNumber] == 1) {
		this.src = motionGif
		clickAmount[clickNumber] = 2
	}

	else {
		this.src = stillGif
		clickAmount[clickNumber] = 1
	}

});

// For first load of page, executes renderButtons function for default topics array
renderButtons();


