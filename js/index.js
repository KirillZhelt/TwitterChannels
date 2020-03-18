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

setupChannelDivs();

twitterAPI.searchChannels();