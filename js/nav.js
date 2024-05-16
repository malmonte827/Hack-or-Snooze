"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
    console.debug("navAllStories", evt);
    hidePageComponents();
    putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
    console.debug("navLoginClick", evt);
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
    console.debug("updateNavOnLogin");
    $(".main-nav-links").show();
    $navLogin.hide();
    $navLogOut.show();
    $navUserProfile.text(`${currentUser.username}`).show();
}

// Shows submit form on click //

function navSubmitStoriesClick(evt) {
    console.debug("navSubmitStoriesClick", evt);
    hidePageComponents();
    $allStoriesList.show();
    $submitForm.show();
}

$body.on("click", "#nav-submit", navSubmitStoriesClick);

// Shows Favorited Stories on click //

function navFavoritesClick(evt) {
    console.debug("navFavoritesClick", evt);
    hidePageComponents();
    putFavoritesOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

// Shows user stories on click //

function navMyStoriesClick(evt) {
    console.debug("navMyStoriesClick", evt);
    hidePageComponents();
    putUserStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStoriesClick);
