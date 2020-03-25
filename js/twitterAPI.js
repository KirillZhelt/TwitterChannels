
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

    async _makeRequest(proxyUrl, url, mapper, onSuccess, onFailure) {
        const response = await fetch(proxyUrl, {
                headers: {
                    'Authorization': this._getOAuthHeaderString({
                           url: url,
                           method: 'GET',
                       }),
                },
            });
        
        const result = await response.json();
        if (response.ok) {
            onSuccess(mapper.call(this, result));
        } else {
            onFailure(result);
        }
    }

    _mapChannelsNeededInformation(resultFromResponse) {
        return resultFromResponse.map(element => {
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
        });
    }

    async searchChannels(searchString, onSuccess, onFailure) {
        this._makeRequest(TwitterAPI._proxy +
            `api.twitter.com:443/1.1/users/search.json?q=${searchString}&count=5`, 
            `https://api.twitter.com/1.1/users/search.json?q=${searchString}&count=5`,
            this._mapChannelsNeededInformation,
            onSuccess, onFailure);
    }

    _mapTweetsNeededInformation(resultFromResponse) {
        return resultFromResponse.map(element => {
            const result = {};
            result.text = element.text;

            if (element.entities.media !== undefined) {
                if (element.entities.media.length > 0) {
                    result.imgSrc = element.entities.media[0].media_url;
                }
            }

            return result;
        });
    }

    async getUserTweets(userId, onSuccess, onFailure) {
        this._makeRequest(TwitterAPI._proxy + 
            `api.twitter.com:443/1.1/statuses/user_timeline.json?user_id=${userId}&trim_user=true`, 
            `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${userId}&trim_user=true`,
            this._mapTweetsNeededInformation,
            onSuccess, onFailure);
    }
}

export const twitterAPI = new TwitterAPI();
