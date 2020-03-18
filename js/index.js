import { twitterAPI } from './twitterAPI.js'

function setupChannelDivs() {
    const channelDivs = document.getElementsByClassName('channel');

    for (let i = 0; i < channelDivs.length; i++) {
        channelDivs[i].addEventListener('click', function() {
            const channelInfoDiv = this.querySelector('.channel__info');
            if (window.getComputedStyle(channelInfoDiv).display === 'none') {
                channelInfoDiv.style.display = 'block';
            } else {
                channelInfoDiv.style.display = 'none';
            }
        });

        const channelDeleteButton = channelDivs[i].querySelector('.channel__delete');
        channelDeleteButton.addEventListener('click', function() {
            this.parentNode.remove();
        });
    }
}

function setupSearchBar() {
    const searchInput = document.querySelector('.search-bar__input');

    let lastUpdate = new Date();
    searchInput.addEventListener('input', function(e) {
        const currentTime = new Date();
        if ((currentTime.getTime() - lastUpdate.getTime()) / 1000 > 1) {
            lastUpdate = currentTime;

            if (this.value.length === 0) {
                showSearchNotFound();
            } else {
                twitterAPI.searchChannels(this.value, showSearchResults, showSearchNotFound);
            }
        } else {
            setTimeout(() => {
                this.dispatchEvent(new Event('input'));
            }, 1500);
        }
    });
}

function showSearchResults(searchResults) {
    const hintsDiv = document.querySelector('.search-bar__dropdown-hints');
    hintsDiv.querySelectorAll('.search-bar__hint').forEach(element => element.remove());

    const hintsNotFound = hintsDiv.querySelector('.search-bar__hints-not-found');
    hintsNotFound.style.display = 'none';

    searchResults.forEach(channel => {
        const channelHint = document.createElement('p');
        channelHint.className = 'search-bar__hint';
        channelHint.textContent = channel.name;

        hintsDiv.append(channelHint);
    });
}

function showSearchNotFound(errorObj) {
    const hintsDiv = document.querySelector('.search-bar__dropdown-hints');
    hintsDiv.querySelectorAll('.search-bar__hint').forEach(element => element.remove());

    const hintsNotFound = hintsDiv.querySelector('.search-bar__hints-not-found');
    hintsNotFound.style.display = '';
}

setupChannelDivs();
setupSearchBar();

