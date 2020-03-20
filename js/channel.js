import { twitterAPI } from './twitterAPI.js';

const name = sessionStorage.getItem('name');
const imgSrc = sessionStorage.getItem('imgSrc');
const id = sessionStorage.getItem('id');

const pageHeader = document.querySelector('.page-header__headline');
pageHeader.textContent = name;

document.title = name;

const tweets = twitterAPI.getUserTweets(id, showTweets, errObj => {
    alert('No tweets are loaded!');
})

function createTweetArticle(tweet) {
    const tweetArticle = document.createElement('article');
    tweetArticle.className = 'tweet';

    const iconImg = document.createElement('img');
    iconImg.className = 'tweet__icon';
    iconImg.src = imgSrc;
    tweetArticle.append(iconImg);

    const tweetText = document.createElement('p');
    tweetText.className = 'tweet__text';
    tweetText.textContent = tweet.text;
    tweetArticle.append(tweetText);

    if (tweet.imgSrc !== undefined) {
        const tweetImg = document.createElement('img');
        tweetImg.className = 'tweet__image';
        tweetImg.src = tweet.imgSrc;
        tweetArticle.append(tweetImg);
    }

    const hr = document.createElement('hr');
    hr.className = 'tweet__line';
    tweetArticle.append(hr);

    return tweetArticle;
}

function showTweets(tweets) {
    const tweetsSection = document.querySelector('.tweets');
    tweets.forEach(tweet => tweetsSection.append(createTweetArticle(tweet)));
}