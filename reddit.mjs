import axios from 'axios'
import {sleep} from './utils.mjs'

export default {
    async fetchPostsInSubRedditByUser(subreddit, user) {
        let pageIndex = 0;
        const results = [];
        const getParams = {
            q: `author:${user}`,
            include_over_18: 'on',
            sort: 'date',
            t: 'all',
            restrict_sr: 'on'
        };
        while(true) {
            console.log(`Loading /r/${subreddit} page ${pageIndex + 1}...`);
            const url = `https://www.reddit.com/r/${subreddit}/search.json?${new URLSearchParams(getParams).toString()}`;
            const response = await axios({
                method: 'get',
                url,
            });
            if(response.status !== 200) {
                throw new Exception("Reddit failure! Is the API still working or the username correct?");
            }
            for(let record of response.data.data.children) {
                record = record.data;
                const post = {
                    title: record.title,
                    originalUrl: `https://old.reddit.com${record.permalink}`,
                    timestampCreated: record.created_utc,
                    nsfw: record.over_18
                };
                if(record.selftext == "") {
                    post.url = record.url;
                }
                else {
                    post.selftext = record.selftext;
                }
                results.push(post);
            }
            if("after" in response.data.data) {
                if(response.data.data.after == null) {
                    break;
                }
                getParams.after = response.data.data.after
            }
            else {
                break;
            }
            pageIndex++;
            // To avoid getting rate-limited
            await sleep(1000);
        }
        return results.reverse();
    }
};