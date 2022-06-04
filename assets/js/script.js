
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

        for (let i = 0; $(".recipe").length; i++) {
            // show recipes
            var recipeImg = document.createElement("img");
            var recipeSave = document.createElement("button");
            var recipeName = document.createElement("p");
            var recipeTime = document.createElement("p");
            var recipeServes = document.createElement("p");
            var recipeDetail = document.createElement("a");

            $(recipeImg).attr({ "src": response.data.hits[i].recipe.image }).css({ 'width': '200px', 'height': '200px' });
            $(".recipe")[i].append(recipeImg);
            $(recipeSave).html("Save This Recipe").attr({ "id": "save", "class": "btn btn-primary m-1 " });
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
            $(recipeDetail).attr({ "href": response.data.hits[i].recipe.url }).html("Link :" + response.data.hits[i].recipe.source).attr({ "class": "text-warning m-1 d-block" });
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
    $("#savedRecipes").addClass("d-none");
});
$("#viewWeather").on("click", function () {
    $("#start").addClass("d-none");
    $("#weather").removeClass("d-none");
    $("#contributors").addClass("d-none");
    $("#recipes").addClass("d-none");
    $("#savedRecipes").addClass("d-none");
})

// show recipe page
$("#making").on("click", function () {
    $("#weather").addClass("d-none");
    $("#contributors").addClass("d-none");
    $("#recipes").removeClass("d-none");
    $("#savedRecipes").addClass("d-none");
})

// show contributors page
$("#viewContributors").on("click", function () {
    $("#contributors").removeClass("d-none");
    $("#start").addClass("d-none");
    $("#weather").addClass("d-none");
    $("#recipes").addClass("d-none");
    $("#savedRecipes").addClass("d-none");
})

// save recipe
$(document).on("click", "#save", function () {
    $(this).html("Saved!").attr({ "class": "btn btn-success m-1" });
    var recipeName = $(this).parent().find("p")[0].innerHTML;
    var recipeImg = $(this).parent().find("img")[0].src;
    var recipeURL = $(this).parent().find("a")[0].href;
    var recipeTime = $(this).parent().find("p")[1].innerHTML;
    var recipeServes = $(this).parent().find("p")[2].innerHTML;

    var recipe = {
        name: recipeName,
        img: recipeImg,
        url: recipeURL,
        time: recipeTime,
        serves: recipeServes
    }

    localStorage.setItem(recipeName, JSON.stringify(recipe));
})

// show saved recipes
$("#viewSavedRecipe").on("click", function () {
    $("#savedRecipes").removeClass("d-none");
    $("#contributors").addClass("d-none");
    $("#start").addClass("d-none");
    $("#weather").addClass("d-none");
    $("#recipes").addClass("d-none");
    for (let i = 0; i < localStorage.length; i++) {
        var recipeName = localStorage.key(i);
        var recipe = JSON.parse(localStorage.getItem(recipeName));


        var savedRecipe = document.createElement("div");
        var savedRecipeImg = document.createElement("img");
        var savedRecipeName = document.createElement("p");
        var savedRecipeTime = document.createElement("p");
        var savedRecipeServes = document.createElement("p");
        var savedRecipeDetail = document.createElement("a");

        $(savedRecipeImg).attr({ "src": recipe.img }).css({ 'width': '150px', 'height': '150px' });
        $(savedRecipe).append(savedRecipeImg);
        $(savedRecipeName).html(recipe.name).attr({ "class": "m-1" });
        $(savedRecipe).append(savedRecipeName);
        $(savedRecipeTime).html("Cook Time: " + recipe.time).attr({ "class": "m-1" });
        $(savedRecipe).append(savedRecipeTime);
        $(savedRecipeServes).html("Serves: " + recipe.serves).attr({ "class": "m-1" });
        $(savedRecipe).append(savedRecipeServes);
        $(savedRecipeDetail).attr({ "href": recipe.url }).html("Link to Recipe").attr({ "class": "text-warning m-1 d-block" });
        $(savedRecipe).append(savedRecipeDetail);
        $(savedRecipe).attr({ "id": i, "class": "savedRecipe col-2 bg-info  text-white m-2 rounded" });
        $("#showSavedRecipes").append(savedRecipe);
    }
})

// clear all saved recipes
$("#clear").on("click", function () {
    localStorage.clear();
    $("#showSavedRecipes").empty();
})