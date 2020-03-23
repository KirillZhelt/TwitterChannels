import { ChannelHintsUpdater } from './hintsUpdater.js';
import { createImage, createSpan, createHeader5, createDiv, createParagraph } from './utils.js';

let chosenChannelId;
let channelHints;

const addedChannels = [];

setupSearchBar();
setupChannelDivs();

const addChannelButton = document.querySelector('.search-bar__button');
addChannelButton.addEventListener('click', function(e) {
    if (chosenChannelId !== undefined) {
        addChannelToList(findChannelById(channelHints, chosenChannelId));

        const searchInput = document.querySelector('.search-bar__input');
        searchInput.disabled = false;
        searchInput.value = '';
    
        const dropdownHints = document.querySelector('.search-bar__dropdown-hints');
        dropdownHints.style.display = '';
    
        showSearchNotFound();
    
        chosenChannelId = undefined;
        channelHints = undefined;
    }
});

function findChannelById(channels, id) {
    return channels.find(element => {
        return element.id === id;
    });
}

function setupChannelDiv(channelDiv) {
    channelDiv.addEventListener('click', function() {
        const channelInfoDiv = this.querySelector('.channel__info');
        if (window.getComputedStyle(channelInfoDiv).display === 'none') {
            channelInfoDiv.style.display = 'block';
        } else {
            channelInfoDiv.style.display = 'none';
        }
    });

    const channelDeleteButton = channelDiv.querySelector('.channel__delete');
    channelDeleteButton.addEventListener('click', function() {
        this.parentNode.remove();
    });

    const channelName = channelDiv.querySelector('.channel__name');
    channelName.addEventListener('click', function(e) {
        const channel = findChannelById(addedChannels, +channelDiv.id);
        sessionStorage.setItem('id', channel.id);
        sessionStorage.setItem('imgSrc', channel.imgSrc);
        sessionStorage.setItem('name', channel.name);

        window.location.href = '/channel.html';

        e.stopPropagation();
    });
}

function setupChannelDivs() {
    const channelDivs = document.getElementsByClassName('channel');

    for (let i = 0; i < channelDivs.length; i++) {
        setupChannelDiv(channelDivs[i]);
    }
}

function setupSearchBar() {
    const searchInput = document.querySelector('.search-bar__input');

    const channelHintsUpdater = new ChannelHintsUpdater();
    searchInput.addEventListener('input', e => {
        channelHintsUpdater.search(e.target.value, results => {
            channelHints = results;
            showSearchResults(channelHints);
        }, errObj => {
            showSearchNotFound(errObj);
        });
    });
}

function createChannelHint(channel) {
    const hintDiv = createDiv('search-bar__hint');

    hintDiv.append(createImage('search-bar__hint-icon', channel.imgSrc));
    hintDiv.append(createSpan('search-bar__hint-name', channel.name));

    if (channel.verified) {
        hintDiv.append(createImage('search-bar__hint-verified', 'media/verified-icon.png'));
    }

    hintDiv.append(createSpan('search-bar__hint-screen-name', '@' + channel.screenName));

    hintDiv.addEventListener('click', function(e) {
        const hints = document.querySelectorAll('.search-bar__hint');
        hints.forEach(element => element.style.backgroundColor = '');

        this.style.backgroundColor = 'yellow';

        const dropdownHints = document.querySelector('.search-bar__dropdown-hints');
        dropdownHints.style.display = 'block';

        const input = document.querySelector('.search-bar__input');
        input.disabled = true;

        chosenChannelId = +this.id;
    });

    return hintDiv;
}

function createChannel(channel) {
    const channelDiv = createDiv('channel');
    channelDiv.id = channel.id;

    channelDiv.append(createHeader5('channel__name', channel.name));
    channelDiv.append(createImage('channel__delete', 'media/recycle-bin.png'));

    const channelInfoDiv = createDiv('channel__info');
    channelDiv.append(channelInfoDiv);

    const descriptionParagraph = createParagraph('', channel.description);
    descriptionParagraph.classList.add('channel__text', 'channel__description');
    channelInfoDiv.append(descriptionParagraph);

    const tweetsParagraph = createParagraph('', 'Tweets: ' + channel.tweetsCount);
    tweetsParagraph.classList.add('channel__text', 'channel__number-of-tweets');
    channelInfoDiv.append(tweetsParagraph);

    const followersParagraph = createParagraph('', 'Followers: ' + channel.followersCount);
    followersParagraph.classList.add('channel__text', 'channel__number-of-followers');
    channelInfoDiv.append(followersParagraph);

    setupChannelDiv(channelDiv);

    return channelDiv;
}

function addChannelToList(channel) {
    addedChannels.push(channel);

    const channelsList = document.querySelector('.channels-list');
    channelsList.append(createChannel(channel));
}

function showSearchResults(searchResults) {
    const hintsDiv = document.querySelector('.search-bar__dropdown-hints');
    hintsDiv.querySelectorAll('.search-bar__hint').forEach(element => element.remove());

    const hintsNotFound = hintsDiv.querySelector('.search-bar__hints-not-found');
    hintsNotFound.style.display = 'none';

    searchResults.forEach(channel => {
        const channelHint = createChannelHint(channel);
        hintsDiv.append(channelHint);
    });
}

function showSearchNotFound(errorObj) {
    const hintsDiv = document.querySelector('.search-bar__dropdown-hints');
    hintsDiv.querySelectorAll('.search-bar__hint').forEach(element => element.remove());

    const hintsNotFound = hintsDiv.querySelector('.search-bar__hints-not-found');
    hintsNotFound.style.display = '';
}
