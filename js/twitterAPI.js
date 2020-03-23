
class TwitterAPI {

    static _oauth = OAuth({
        consumer: {
            key: 'DDmEuJNPPvzlh6cq2ZLnXXuoC',
            secret: 'PrBYJ7X3VVrbZT0235GcOlXGyfgxRCgattk2ocuTxiGX18fVCv',
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64)
        },
    });

    static _token = {
        key: '1219216442236817409-BBotPv1awrQdJrHU6LS2jG4ni7G9sL',
        secret: 'ohkHDTQwPbDV2KZcQmPJiUUKBbAYQ5GXxpciMJTwxnGlv',
    };

    static _proxy = 'https://cors-anywhere.herokuapp.com/';

    _isSubscribed = true;

    _getOAuthHeaderString(requestData) {
        return TwitterAPI._oauth.toHeader(TwitterAPI._oauth.authorize(requestData, TwitterAPI._token))
                                .Authorization;
    }

    unsubscribe() {
        this._isSubscribed = false;
    }

    subscribe() {
        this._isSubscribed = true;
    }

    _onChannelsSearchReadyStateChange(xhr, onSuccess, onFailure) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const result = JSON.parse(xhr.responseText);

            if (xhr.status === 200) {
                if (this._isSubscribed) {
                    onSuccess(result.map(element => {
                        return {
                            id: element.id,
                            name: element.name,
                            screenName: element.screen_name,
                            verified: element.verified,
                            imgSrc: element.profile_image_url,
                            description: element.description,
                            followersCount: element.followers_count,
                            tweetsCount: element.statuses_count,
                        };
                    }));
                }
            } else {
                if (this._isSubscribed) {
                    onFailure(result);
                }
            }
        }
    }

    searchChannels(searchString, onSuccess, onFailure) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            this._onChannelsSearchReadyStateChange(xhttp, onSuccess, onFailure);
        };
        xhttp.open('GET', TwitterAPI._proxy + `api.twitter.com:443/1.1/users/search.json?q=${searchString}&count=5`, 
            true);
        xhttp.setRequestHeader('Authorization', this._getOAuthHeaderString({
            url: `https://api.twitter.com/1.1/users/search.json?q=${searchString}&count=5`,
            method: 'GET',
        }));
        xhttp.send();
    }
 
    _onGetUserTweetsReadyStateChange(xhr, onSuccess, onFailure) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const result = JSON.parse(xhr.responseText);

            if (xhr.status === 200) {
                onSuccess(result.map(element => {
                    const result = {};
                    result.text = element.text;

                    if (element.entities.media !== undefined) {
                        if (element.entities.media.length > 0) {
                            result.imgSrc = element.entities.media[0].media_url;
                        }
                    }

                    return result;
                }));
            } else {
                onFailure(result);
            }
        }
    }

    getUserTweets(userId, onSuccess, onFailure) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            this._onGetUserTweetsReadyStateChange(xhttp, onSuccess, onFailure);
        }
        xhttp.open('GET', TwitterAPI._proxy + `api.twitter.com:443/1.1/statuses/user_timeline.json?user_id=${userId}&trim_user=true`, 
            true);
        xhttp.setRequestHeader('Authorization', this._getOAuthHeaderString({
            url: `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${userId}&trim_user=true`,
            method: 'GET',
        }));
        xhttp.send();
    }
}

export const twitterAPI = new TwitterAPI();
