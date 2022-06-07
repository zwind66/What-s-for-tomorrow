

// APIKeys
var APIKey = "e1de4dde4a3848391fcce5cdaca68968";
var apiKey = "5d5d79c2c0msh5d8b76850693b7ep1e1c05jsn7b1b3e77821b";

// get weather from open weather api
function getWeather(cityName) {
    $('#check').removeClass('is-hidden');
    var URL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;
    axios.get(URL).then(function (response) {
        // display next day's weather
        $("#city-name").html(response.data.name + ' (' + new Date((response.data.dt + 86400) * 1000).toLocaleDateString('en-US') + ')');

        var cityID = response.data.id;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial&appid=" + APIKey;
        axios.get(forecastURL).then(function (response) {
            $("#cityWeather").html(response.data.list[6].weather[0].description);
            $("#weather-img").attr({ "src": "https://openweathermap.org/img/wn/" + response.data.list[6].weather[0].icon + "@2x.png", "alt": "Weather icon" });
            $("#temperature").html("Temp: " + Math.floor(response.data.list[6].main.temp) + " °F");
            $("#wind").html("Wind: " + response.data.list[6].wind.speed + " MPH");
            $("#humidity").html("Humidity: " + response.data.list[6].main.humidity + "%");
        });
    }).catch(function (err) {
        console.log(err);
    })
};

// get recipe from open recipe api
function getRecipe(ingredient) {
    var recipeURL = "https://edamam-recipe-search.p.rapidapi.com/search?q=" + ingredient + "&rapidapi-key=" + apiKey;
    axios.get(recipeURL).then(function (response) {

        $("#recipesList").html("");
        // display recipe
        for (let i = 0; i < 10; i++) {
            var recipeList = document.createElement("div");
            var recipeImg = document.createElement("img");
            var recipeSave = document.createElement("button");
            var recipeName = document.createElement("p");
            var recipeTime = document.createElement("p");
            var recipeServes = document.createElement("p");
            var recipeDetail = document.createElement("a");
            var recipeSaveBlocked = document.createElement("div");

            $(recipeSaveBlocked).attr({ "class": "block" })
            $(recipeSaveBlocked).append(recipeSave);
            $(recipeImg).attr({ "src": response.data.hits[i].recipe.image, "class": "block" }).css({ 'width': 'auto', 'height': 'auto' });
            $(recipeList).append(recipeImg);
            $(recipeSave).html("Save This Recipe").attr({ "id": "save", "class": "button is-info is-rounded m-1 block ", "type": "button" });
            $(recipeList).append(recipeSaveBlocked);
            $(recipeName).html(response.data.hits[i].recipe.label).attr({ "class": "m-1" });
            $(recipeList).append(recipeName);
            if (response.data.hits[i].recipe.totalTime === 0) {
                $(recipeTime).html("Cook Time: N/A").attr({ "class": "m-1" });
            } else {
                $(recipeTime).html("Cook Time: " + response.data.hits[i].recipe.totalTime + " minutes").attr({ "class": "m-1" });
            }
            $(recipeList).append(recipeTime);
            $(recipeServes).html("Serves: " + response.data.hits[i].recipe.yield).attr({ "class": "m-1" });
            $(recipeList).append(recipeServes);
            $(recipeDetail).attr({ "href": response.data.hits[i].recipe.url }).html("Link :" + response.data.hits[i].recipe.source).attr({ "class": "text-warning m-1 d-block" });
            $(recipeList).append(recipeDetail);
            $(recipeList).attr({ "id": i, "class": "column is-2 is-rounded has-background-primary has-text-light has-text-weight-bold m-2" });
            $("#recipesList").append(recipeList);
        }
    }).catch(function (err) {
        console.log(err);
    })
};

// save recipe
$(document).on("click", "#save", function () {
    $(this).html("Saved!").attr({ "class": "button is-rounded is-success m-1", "type": "button" });
    var recipeName = $(this).parent().parent().find("p")[0].innerHTML;
    var recipeImg = $(this).parent().parent().find("img")[0].src;
    var recipeURL = $(this).parent().parent().find("a")[0].href;
    var recipeTime = $(this).parent().parent().find("p")[1].innerHTML;
    var recipeServes = $(this).parent().parent().find("p")[2].innerHTML;

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
    $("#savedRecipes").removeClass("is-hidden");
    $("#contributors").addClass("is-hidden");
    $("#start").addClass("is-hidden");
    $("#weather").addClass("is-hidden");
    $("#recipes").addClass("is-hidden");

    $("#showSavedRecipes").html("");
    for (let i = 0; i < localStorage.length; i++) {
        var recipeName = localStorage.key(i);
        var recipe = JSON.parse(localStorage.getItem(recipeName));


        var savedRecipe = document.createElement("div");
        var savedRecipeImg = document.createElement("img");
        var savedRecipeName = document.createElement("p");
        var savedRecipeTime = document.createElement("p");
        var savedRecipeServes = document.createElement("p");
        var savedRecipeDetail = document.createElement("a");

        $(savedRecipeImg).attr({ "src": recipe.img }).css({ 'width': 'auto', 'height': 'auto' });
        $(savedRecipe).append(savedRecipeImg);
        $(savedRecipeName).html(recipe.name).attr({ "class": "m-1" });
        $(savedRecipe).append(savedRecipeName);
        $(savedRecipeTime).html("Cook Time: " + recipe.time).attr({ "class": "m-1" });
        $(savedRecipe).append(savedRecipeTime);
        $(savedRecipeServes).html("Serves: " + recipe.serves).attr({ "class": "m-1" });
        $(savedRecipe).append(savedRecipeServes);
        $(savedRecipeDetail).attr({ "href": recipe.url }).html("Link to Recipe").attr({ "class": "text-warning m-1 d-block" });
        $(savedRecipe).append(savedRecipeDetail);
        $(savedRecipe).attr({ "id": i, "class": "column is-2 is-rounded has-background-primary has-text-light has-text-weight-bold m-2" });
        $("#showSavedRecipes").append(savedRecipe);
    }
})

// clear all saved recipes
$("#clear").on("click", function () {
    localStorage.clear();
    $("#showSavedRecipes").empty();
})

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
    $("#start").addClass("is-hidden");
    $("#weather").removeClass("is-hidden");
    $("#contributors").addClass("is-hidden");
    $("#savedRecipes").addClass("is-hidden");
});
$("#viewWeather").on("click", function () {
    $("#start").addClass("is-hidden");
    $("#weather").removeClass("is-hidden");
    $("#contributors").addClass("is-hidden");
    $("#recipes").addClass("is-hidden");
    $("#savedRecipes").addClass("is-hidden");
})

// show recipe page
$("#making").on("click", function () {
    $("#weather").addClass("is-hidden");
    $("#contributors").addClass("is-hidden");
    $("#recipes").removeClass("is-hidden");
    $("#savedRecipes").addClass("is-hidden");
})

// show contributors page
$("#viewContributors").on("click", function () {
    $("#contributors").removeClass("is-hidden");
    $("#start").addClass("is-hidden");
    $("#weather").addClass("is-hidden");
    $("#recipes").addClass("is-hidden");
    $("#savedRecipes").addClass("is-hidden");
})

// moblie menu
$("#navbarBurger").on("click", function () {
    $("#navbarBurger").toggleClass("is-active");
    $("#navbarBasic").toggleClass("is-active");
})
