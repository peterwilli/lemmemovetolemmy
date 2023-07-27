#!/usr/bin/env node

import { program } from 'commander';
import { LemmyHttp } from 'lemmy-js-client';
import passwordPrompt from 'password-prompt';
import reddit from './reddit.mjs'
import { truncate } from './utils.mjs';

async function main() {
  program
    .requiredOption('-i --instance-url <string>')
    .requiredOption('-c --lemmy-community-name <string>')
    .requiredOption('-u --username <string>')
    .option('-p --password <string>')
    .option('-o --totp-token <string>')
    .requiredOption('-s --subreddit <string>')
    .requiredOption('-r --reddit-username <string>');

  program.parse();

  const options = program.opts();
  let password;
  if (!('password' in options)) {
    password = await passwordPrompt('Lemmy password (hidden, not stored anywhere): ', {
      method: "hide"
    });
  }
  else {
    password = options.password;
  }

  let totpToken = null;
  if('totpToken' in options) {
    if(options.totpToken == "prompt") {
      totpToken = await passwordPrompt('2fa token (hidden, not stored anywhere): ', {
        method: "hide"
      });
    }
    else {
      totpToken = options.totpToken
    }
  }

  const client = new LemmyHttp(options.instanceUrl);
  const loginForm = {
    username_or_email: options.username,
    password,
  };
  if(totpToken != null) {
    loginForm.totp_2fa_token = totpToken
  }

  const loginResult = await client.login(loginForm);
  const jwt = loginResult.jwt;
  const posts = await reddit.fetchPostsInSubRedditByUser(options.subreddit, options.redditUsername);
  const community = await client.getCommunity({
    auth: jwt,
    name: options.lemmyCommunityName
  });
  for(const post of posts) {
    console.log(`Importing ${post.title}...`);
    const newPost = {
      auth: jwt,
      nsfw: post.nsfw,
      community_id: community.community_view.community.id,
      name: truncate(post.title, 199)
    };
    newPost.body = `This post is originally created by /u/${options.redditUsername} at ${new Date(post.timestampCreated * 1000).toUTCString()} UTC. [Click here to view original post](${post.originalUrl}).`;
    if('selftext' in post) {
      newPost.body += "\n\n-------\n\n"
      newPost.body += post.selftext
    }
    if('url' in post) {
      newPost.url = post.url;
    }
    await client.createPost(newPost);
  }
}

main();