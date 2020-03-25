import { twitterAPI } from './twitterAPI.js'

export class ChannelHintsUpdater {

    // undefined value means no query in cache, null means query is pending, and other value is real value
    queriesCache = new Map();

    queryRequestTimestamps = new Map();
    
    _findLater(input) {
        const laterQueries = [];

        this.queryRequestTimestamps.forEach((value, key, m) => {
            if (value.getTime() > m.get(input).getTime()) {
                laterQueries.push(key);
            }
        });

        return laterQueries;
    }

    _isLatestPossible(input) {
        const laterQueries = this._findLater(input);

        for (const laterQuery of laterQueries) {
            if (this.queriesCache.get(laterQuery) !== undefined && this.queriesCache.get(laterQuery) !== null) {
                return false;
            }
        }

        return true;
    }

    _loadValue(input, onSearchResults, onSearchNotFound) {
        this.queriesCache.set(input, null); // means that request is pending

        twitterAPI.searchChannels(input, elements => {
            this.queriesCache.set(input, elements);
            
            if (this._isLatestPossible(input)) {
                onSearchResults(elements);
            }
        }, errObj => {
            this.queriesCache.set(input, undefined);
            onSearchNotFound(errObj);
        });
    }

    search(input, onSearchResults, onSearchNotFound) {
        if (input.length === 0) {
            onSearchNotFound();
            return;
        }

        this.queryRequestTimestamps.set(input, new Date());

        if (this.queriesCache.get(input) !== undefined && this.queriesCache.get(input) !== null) {
            onSearchResults(this.queriesCache.get(input));
        } else {
            if (this.queriesCache.get(input) === undefined) {
                this._loadValue(input, onSearchResults, onSearchNotFound);
            }
        }
    }
}