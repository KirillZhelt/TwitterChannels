import { ChannelHintsUpdater } from './hintsUpdater.js';

let chosenChannelId;
let channelHints;

const addedChannels = [];

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
    const hintDiv = document.createElement('div');
    hintDiv.className = 'search-bar__hint';
    hintDiv.id = channel.id;

    const hintIconImg = document.createElement('img');
    hintIconImg.className = 'search-bar__hint-icon';
    hintIconImg.src = channel.imgSrc;
    hintDiv.append(hintIconImg);

    const hintNameSpan = document.createElement('span');
    hintNameSpan.className = 'search-bar__hint-name';
    hintNameSpan.textContent = channel.name;
    hintDiv.append(hintNameSpan);

    if (channel.verified) {
        const hintVerifiedImg = document.createElement('img');
        hintVerifiedImg.className = 'search-bar__hint-verified';
        hintVerifiedImg.src = 'media/verified-icon.png';
        hintDiv.append(hintVerifiedImg);
    }

    const hintScreenNameSpan = document.createElement('span');
    hintScreenNameSpan.className = 'search-bar__hint-screen-name';
    hintScreenNameSpan.textContent = '@' + channel.screenName;
    hintDiv.append(hintScreenNameSpan);

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
    const channelDiv = document.createElement('div');
    channelDiv.className = 'channel';
    channelDiv.id = channel.id;

    const nameHeader = document.createElement('h5');
    nameHeader.className = 'channel__name';
    nameHeader.textContent = channel.name;
    channelDiv.append(nameHeader);

    const binImg = document.createElement('img');
    binImg.className = 'channel__delete';
    binImg.src = 'media/recycle-bin.png';
    channelDiv.append(binImg);

    const channelInfoDiv = document.createElement('div');
    channelInfoDiv.className = 'channel__info';
    channelDiv.append(channelInfoDiv);

    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.classList.add('channel__text', 'channel__description');
    descriptionParagraph.textContent = channel.description;
    channelInfoDiv.append(descriptionParagraph);

    const tweetsParagraph = document.createElement('p');
    tweetsParagraph.classList.add('channel__text', 'channel__number-of-tweets');
    tweetsParagraph.textContent = 'Tweets: ' + channel.tweetsCount;
    channelInfoDiv.append(tweetsParagraph);

    const followersParagraph = document.createElement('p');
    followersParagraph.classList.add('channel__text', 'channel__number-of-followers');
    followersParagraph.textContent = 'Followers: ' + channel.followersCount;
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
