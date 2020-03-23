import { twitterAPI } from './twitterAPI.js';
import { createImage, createParagraph, createLine } from './utils.js';

const name = sessionStorage.getItem('name');
const imgSrc = sessionStorage.getItem('imgSrc');
const id = sessionStorage.getItem('id');

const pageHeader = document.querySelector('.page-header__headline');
pageHeader.textContent = name;

document.title = name;

const tweets = twitterAPI.getUserTweets(id, showTweets, errObj => {
    alert('No tweets are loaded!');
});

function createTweetArticle(tweet) {
    const tweetArticle = document.createElement('article');
    tweetArticle.className = 'tweet';

    tweetArticle.append(createImage('tweet__icon', imgSrc));
    tweetArticle.append(createParagraph('tweet__text', tweet.text));

    if (tweet.imgSrc !== undefined) {
        tweetArticle.append(createImage('tweet__image', tweet.imgSrc));
    }

    tweetArticle.append(createLine('tweet__line'));

    return tweetArticle;
}

function showTweets(tweets) {
    const tweetsSection = document.querySelector('.tweets');
    tweets.forEach(tweet => tweetsSection.append(createTweetArticle(tweet)));
}