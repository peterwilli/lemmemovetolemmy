# Lemme move to Lemmy!

Easily move your own posts from any subreddit to any Lemmy community!

## How it works

We call the Reddit API to fetch any post made by a given username (you) and then call the Lemmy instance API in question to repost the post on Lemmy.

## Advantages

 - You can use your new account on Lemmy to share your Reddit post, and it physically rests on Lemmy, effectively supporting migration for users.

 - You don't need to own a Lemmy instance or be a database admin or crawl webpages because we call Lemmy API directly.

## How to use it?

 - Make sure to install nodejs first!
 - See examples below, for more combinations, run `npx lemmemovetolemmy --help`

## Examples 

Migrate all dreams by testuser on Reddit /r/dreams to testuser2 Lemmy "dreaming" community, and prompt for a password

```
npx lemmemovetolemmy --instance-url https://lemmy.emerald.show --username testuser2 --subreddit Dreams --reddit-username testuser --lemmy-community-name dreaming
```

Migrate all dreams by testuser on Reddit /r/dreams to testuser2 Lemmy "dreaming" community, and prompt for a password and 2 factor authentication token.

```
npx lemmemovetolemmy --instance-url https://lemmy.emerald.show --username testuser2 --subreddit Dreams --reddit-username testuser --lemmy-community-name dreaming --totp-token prompt
```

Migrate all dreams by testuser on Reddit /r/dreams to testuser2 Lemmy "dreaming" community, and pre-enter password

```
npx lemmemovetolemmy --instance-url https://lemmy.emerald.show --username testuser2 --subreddit Dreams --reddit-username testuser --lemmy-community-name dreaming --password=secret
```