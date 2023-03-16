// Open and hide Side-Menu Logic
var sideOption = document.getElementById("side");
function showMenu() {
    sideOption.style.top = "0px";
}
function hideMenu() {
    sideOption.style.top = "-1000px";
}

// FETCHING API OF IMDB
var container = document.getElementById('movies');
var search = document.getElementById('searchMovie');

// FETCHING API OF IMDB
const API_KEY = 'api_key=49e3be45df1c1a483b5eb9560e3c73ab';
//BASE_URL
const BASE_URL = 'https://api.themoviedb.org/3';
//IMAGE_URL API
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Storing Id's in Variables
let id = '';
const urlParams = new URLSearchParams(location.search);
for (const [key, value] of urlParams) {
    id = value;

}
// we create link of single movie item by IMDb Api 
let link = `/movie/${id}?language=en-US&append_to_response=videos&`;
let find_url = BASE_URL + link + API_KEY;



// Requesting API by calling function
apiCall(find_url);

// function to create element 
function apiCall(url) {
    console.log(url)
  //Three steps are required to send a 'GET' request: first, create an XMLHttpRequest, then open an HTTP request, and last deliver the request.

  // create an XMLHttpRequest
    const x = new XMLHttpRequest();

    // open an HTTP request
    x.open('get', url);

   // deliver the request. 
    x.send();

     //Here we can handle XHR object answers using the event handlers after the request has been sent.
    x.onload = function () {
        document.getElementById('movie-display').innerHTML = '';
        var res = x.response;
        var Json = JSON.parse(res);
        getMovies(Json);
    }
    x.onerror = function () {
        window.alert('cannot get')
    }
}


// FILTER THE VIDEO WHICH ARE IN ARRAY
function filterArray(obj) {
    var vtitle = obj.name
    var rg = /Official Trailer/i;
    if (vtitle.match(rg)) {
        return obj;
    }
}

function getMovies(myJson) {
    // Fetch Movie YT Link
    var MovieTrailer = myJson.videos.results.filter(filterArray);
    // Fecth BG-Image for the movie
    document.body.style.backgroundImage = `url(${IMAGE_URL + myJson.backdrop_path})`;
    var movieDiv = document.createElement('div');
    movieDiv.classList.add('each-movie-page');

    // Creating YT LINK
    var youtubeURL;
    if (MovieTrailer.length == 0) {
        if (myJson.videos.results.length == 0) {
            youtubeURL = '';
        } else {
            youtubeURL = `https://www.youtube.com/embed/${myJson.videos.results[0].key}`;
        }
    } else {
        youtubeURL = `https://www.youtube.com/embed/${MovieTrailer[0].key}`;
    }

    // MOVIE DETAIL PAGE STRUCTURE
    movieDiv.innerHTML = `
        <div class="movie-poster">
            <img src=${IMAGE_URL + myJson.poster_path} alt="Poster">
        </div>
        <div class="movie-details">
            <div class="title">
                ${myJson.title}
            </div>

            <div class="tagline">${myJson.tagline}</div>

            <div style="display: flex;"> 
                <div class="movie-duration">
                    <b><i class="fas fa-clock"></i></b> ${myJson.runtime}
                </div>
                <div class="release-date">
                    <b>Released</b>: ${myJson.release_date}
                </div>
            </div>

            <div class="rating">
                <b>IMDb Rating</b>: ${myJson.vote_average}
            </div>

            <div class="trailer-div" id="trailer-div-btn">
               <span> <i class="fab fa-youtube"></i>WATCH TRAILER BELOW</span>
            </div>
              <span><iframe width="460" height="250" src=${youtubeURL} title="YouTube video player" frameborder="0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ></iframe ></span >
          
            <div class="plot">
                ${myJson.overview}
            </div>
        </div>
    `;
//    // Appending HTML to Movie-Display Container
    document.getElementById('movie-display').appendChild(movieDiv);
}
