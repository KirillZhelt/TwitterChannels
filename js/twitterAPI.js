
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
    }

    _getOAuthHeaderString(requestData) {
        return TwitterAPI._oauth.toHeader(TwitterAPI._oauth.authorize(requestData, TwitterAPI._token))
                                .Authorization;
    }

    searchChannels(searchString) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    alert(this.responseText);
                } else {
                    alert(this.responseText);
                }
            }
        };
        xhttp.open('GET', 'https://cors-anywhere.herokuapp.com/api.twitter.com:443/1.1/users/search.json?q=soccer', 
            true);
        xhttp.setRequestHeader('Authorization', this._getOAuthHeaderString({
            url: 'https://api.twitter.com/1.1/users/search.json?q=soccer',
            method: 'GET',
        }));
        xhttp.send();
    }
}

export const twitterAPI = new TwitterAPI();
