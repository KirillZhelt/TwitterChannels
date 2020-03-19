import { twitterAPI } from './twitterAPI.js'

class ChannelHintsUpdater {

    // undefined value means no query in cache, null means query is pending, and other value is real value
    queriesCache = new Map();

    queryRequestTimestamps = new Map();
    
    isLatestPossible(input) {
        const laterQueries = [];

        this.queryRequestTimestamps.forEach((value, key, m) => {
            if (value.getTime() > m.get(input).getTime()) {
                laterQueries.push(key);
            }
        });

        for (const laterQuery of laterQueries) {
            if (this.queriesCache.get(laterQuery) !== undefined && this.queriesCache.get(laterQuery) !== null) {
                return false;
            }
        }

        return true;
    }

    search(e) {
        const input = e.target.value;
        if (input.length === 0) {
            showSearchNotFound();
            return;
        }

        this.queryRequestTimestamps.set(input, new Date());

        if (this.queriesCache.get(input) !== undefined && this.queriesCache.get(input) !== null) {
            showSearchResults(this.queriesCache.get(input));
        } else {
            if (this.queriesCache.get(input) === undefined) {
                this.queriesCache.set(input, null); // means that request is pending

                twitterAPI.searchChannels(input, elements => {
                    this.queriesCache.set(input, elements);
                    
                    if (this.isLatestPossible(input)) {
                        showSearchResults(elements);
                    }
                }, errObj => {
                    this.queriesCache.set(input, undefined);
                    showSearchNotFound(errObj);
                });
            }
        }
    }
}

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

    const channelHintsUpdater = new ChannelHintsUpdater();
    searchInput.addEventListener('input', e => {
        channelHintsUpdater.search(e);
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
        channelHint.addEventListener('click', function(e) {
            this.parentElement.style.display = "block";
            this.style.backgroundColor = "yellow";
        });

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
