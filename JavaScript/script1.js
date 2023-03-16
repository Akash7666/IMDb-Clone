

// Open and hide Side-Menu Logic
var sideOption = document.getElementById("side");
function showMenu() {
    sideOption.style.top = "0px";
}
function hideMenu() {
    sideOption.style.top = "-1000px";
}

// FETCHING API OF IMDB
const API_KEY = 'api_key=49e3be45df1c1a483b5eb9560e3c73ab';
const API_URL = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;

//IMAGE_URL API
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Storing Id's in Variables
var container = document.getElementById('movies');
var search = document.getElementById('searchMovie');

//BUTTONS
var prevBtn = document.getElementById('prev-page');
var nextBtn = document.getElementById('next-page');

// PageCount
let pageNumber = 1;


// Requesting API by calling function
apiCall(API_URL);
// This function get API_data
function apiCall(url) {
    //Three steps are required to send a 'GET' request: first, create an XMLHttpRequest, then open an HTTP request, and last deliver the request.

    // create an XMLHttpRequest
    const x = new XMLHttpRequest();
    // open an HTTP request
    x.open('get', url);
    // deliver the request. 
    x.send();
    //Here we can handle XHR object answers using the event handlers after the request has been sent.
    x.onload = function () {
        container.innerHTML="";
        var res = x.response;
        // resp to JSON data 
        var conJson = JSON.parse(res);
        // array of movies 
        var moviesArray = conJson.results;
     
        // create the movie cards here 
        moviesArray.forEach(movie => moviesElement(movie));
        
    }
}


// CREATING HOME_PAGE ELEMENT
function moviesElement(movie) {
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    
    movieElement.innerHTML = `
    <a href="./MoviePage/moviePage.html?id=${movie.id}"><img src=${IMAGE_URL + movie.poster_path} alt="{movie.id}"></a>
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <div class="star-fab">
      <div class="add-movie-to-list" id="${movie.id}" onclick="addMovie(${movie.id})">
      <span class="icon-color"><i class="fa-regular fa-heart"></i></span>
      </div>
        <span class="icon-color"><i class="fa-solid fa-star">&nbsp;</i>${movie.vote_average}</span>
      </div>
    </div>
    <div class="overview">${movie.overview}</div>`;
    // Appending HTML to MovieElement Container
    container.appendChild(movieElement);
}

// Creating Array to store movie 
var favMovies = [];
// to keep previous stored movies
var oldLocalsMov=[];

// Adding movie to Favorites
function addMovie(btnId){
    document.getElementById(btnId).innerHTML = '<span class="icon-color"><i class="fa-solid fa-heart"></i></span>';
    // to Counter duplicate movies in array
    if(!favMovies.includes(btnId.toString())){
        favMovies.push(btnId.toString());
    }
    // Accessing array from local
    oldLocalsMov = JSON.parse(localStorage.getItem('MovieArray'));
    if(oldLocalsMov==null){
        // if null
        localStorage.setItem('MovieArray', JSON.stringify(favMovies));
    }else{
        // if not null
        favMovies.forEach(item=>{
            if(!oldLocalsMov.includes(item)){
                oldLocalsMov.push(item);
            }
        })
        // pushing movie in local storage
        localStorage.setItem('MovieArray', JSON.stringify(oldLocalsMov));
    }
}


// Search Function
search.addEventListener('keyup', function(){

    var input = search.value;
    console.log(input)
    
    var inputUrl = `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${input}`;
    
    if(input.length !=0){
        apiCall(inputUrl);
    }else{
        window.location.reload();
    }
})


// if Page is 1,Disable prev btn
prevBtn.disabled = true;
function disablePBtn() {
    if (pageNumber == 1) prevBtn.disabled = true;
    else prevBtn.disabled = false;
}
//If PgNo is >1 then call API 

nextBtn.addEventListener('click', () => {
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

// if Prev is  not 1 then call API
prevBtn.addEventListener('click', () => {
    if (pageNumber == 1) return;

    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
})
