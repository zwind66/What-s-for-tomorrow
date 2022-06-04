
// APIKeys
var APIKey = "e1de4dde4a3848391fcce5cdaca68968";
var apiKey = "5d5d79c2c0msh5d8b76850693b7ep1e1c05jsn7b1b3e77821b";

// get weather from open weather api
function getWeather(cityName) {
    var URL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;
    axios.get(URL).then(function (response) {
        // display next day's weather
        $("#city-name").html(response.data.name + ' (' + new Date((response.data.dt + 86400) * 1000).toLocaleDateString('en-US') + ')');

        var cityID = response.data.id;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial&appid=" + APIKey;
        axios.get(forecastURL).then(function (response) {
            $("#cityWeather").html(response.data.list[6].weather[0].description);
            $("#weather-img").attr({ "src": "http://openweathermap.org/img/wn/" + response.data.list[6].weather[0].icon + "@2x.png", "alt": "Weather icon" });
            $("#temperature").html("Temp: " + Math.floor(response.data.list[6].main.temp) + " °F");
            $("#wind").html("Wind: " + response.data.list[6].wind.speed + " MPH");
            $("#humidity").html("Humidity: " + response.data.list[6].main.humidity + "%");
        });
    }).catch(function (err) {
        console.log(err);
    })
};

function getRecipe(ingredient) {
    var recipeURL = "https://edamam-recipe-search.p.rapidapi.com/search?q=" + ingredient + "&rapidapi-key=" + apiKey;
    axios.get(recipeURL).then(function (response) {
        console.log(response);

        for (let i = 0; $(".recipe").length; i++) {
            // show recipes
            $(".recipe")[i].innerHTML = "";
            var recipeImg = document.createElement("img");
            var recipeSave = document.createElement("button");
            var recipeName = document.createElement("p");
            var recipeTime = document.createElement("p");
            var recipeServes = document.createElement("p");
            var recipeDetail = document.createElement("a");
            
            $(recipeImg).attr({ "src": response.data.hits[i].recipe.image }).css({'width': '200px', 'height': '200px'});
            $(".recipe")[i].append(recipeImg);
            $(recipeSave).html("Save This Recipe").attr({"id": "save", "class": "btn btn-primary m-1 "});
            $(".recipe")[i].append(recipeSave);
            $(recipeName).html(response.data.hits[i].recipe.label).attr({ "class": "m-1" });
            $(".recipe")[i].append(recipeName);

            if (response.data.hits[i].recipe.totalTime === 0) {
                $(recipeTime).html("Cook Time: N/A").attr({ "class": "m-1" });
            } else {
                $(recipeTime).html("Cook Time: " + response.data.hits[i].recipe.totalTime + " minutes").attr({ "class": "m-1" });
            }
            $(".recipe")[i].append(recipeTime);

            $(recipeServes).html("Serves: " + response.data.hits[i].recipe.yield).attr({ "class": "m-1" });
            $(".recipe")[i].append(recipeServes);
            $(recipeDetail).attr({ "href": response.data.hits[i].recipe.url}).html(response.data.hits[i].recipe.source).attr({ "class": "text-white m-1 d-block" });
            $(".recipe")[i].append(recipeDetail);
        }
    }).catch(function (err) {
        console.log(err);
    })
};

// search for weather
$('#search').on("click", function () {
    var cityName = $("#enterCity").val();
    getWeather(cityName);
})

// search for recipes
$('#add').on("click", function () {
    var ingredient = $("#enterIngredient").val();
    getRecipe(ingredient);
})

// show weather page
$('#start-btn').on("click", function () {
    $("#start").addClass("d-none");
    $("#weather").removeClass("d-none");
    $("#contributors").addClass("d-none");
});
$("#viewWeather").on("click", function () {
    $("#start").addClass("d-none");
    $("#weather").removeClass("d-none");
    $("#contributors").addClass("d-none");
    $("#recipes").addClass("d-none");
})

// show recipe page
$("#making").on("click", function () {
    $("#weather").addClass("d-none");
    $("#contributors").addClass("d-none");
    $("#recipes").removeClass("d-none");
})

// show contributors page
$("#viewContributors").on("click", function () {
    $("#contributors").removeClass("d-none");
    $("#start").addClass("d-none");
    $("#weather").addClass("d-none");
    $("#recipes").addClass("d-none");
})





