"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();

    putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
 //console.debug("generateStoryMarkup", story);

    const hostName = story.getHostName();
    const showStar = Boolean(currentUser);
    return $(`
      <li id="${story.storyId}">
      ${showDeleteButton ? getDeleteHTML() : ""}
      ${showStar ? starHTML(story, currentUser) : ""}
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
          </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function starHTML(story, user) {
    const isFavorite = user.isFavorite(story);
    const starType = isFavorite ? "fas" : "far";
    return `<span class="star">
  <i class="${starType} fa-star"></i>
  </span>`;
}

function getDeleteHTML(){
    return `
    <span class="trash-can">
    <i class="fas fa-trash"></i>  </span>`
}


async function deleteStory(evt){
    const $closestLi = $(evt.target).closest("li");
    const storyId = $closestLi.attr("id")

    await storyList.removeStory(currentUser, storyId)

    await putUserStoriesOnPage()
}
$userStories.on("click", ".trash-can", deleteStory)

function putStoriesOnPage() {
    console.debug("putStoriesOnPage");

    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
        const $story = generateStoryMarkup(story);
        $allStoriesList.append($story);
    }

    $allStoriesList.show();
}

async function addSubmittedStory(evt) {
    console.debug("addSubmittedStory");
    evt.preventDefault();

    // grabbed info from form
    const username = currentUser.username;
    const title = $("#title-submit-form").val();
    const author = $("#author-submit-form").val();
    const url = $("#url-submit-form").val();
    const storyData = { username, title, author, url };

    // await storyList.addStory(currentUser, data);
    const newStory = await storyList.addStory(currentUser, storyData);

    const storyMarkup = generateStoryMarkup(newStory);
    $allStoriesList.prepend(storyMarkup);

    $submitForm.hide();
    $submitForm.trigger("reset");
}
$submitForm.on("submit", addSubmittedStory);

/***************************************************************************
 
 */
// Handles favoriting/un-favriting stories//

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$body.on("click", ".star", toggleStoryFavorite);


// Displays favorited Stories on page //

function putFavoritesOnPage() {
    $favoritedStories.empty();

    if (currentUser.favorites.length === 0) {
        $favoritedStories.append("No favorites added!");
    } else {
        for (let story of currentUser.favorites) {
            const $story = generateStoryMarkup(story);
            $favoritedStories.append($story);
        }
    }
    $favoritedStories.show();
}

// Displays Users Stories on page //

function putUserStoriesOnPage() {
    $userStories.empty();

    if (currentUser.ownStories.length === 0) {
        $userStories.append("No stories added by user yet!");
    } else {
        for (let story of currentUser.ownStories) {
            const $story = generateStoryMarkup(story, true);
            $userStories.append($story);
        }
    }
    $userStories.show();
}
