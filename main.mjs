import { program } from 'commander';
import { LemmyHttp } from 'lemmy-js-client';
import passwordPrompt from 'password-prompt';

async function main() {
  program
    .requiredOption('-i --instance-url <string>')
    .requiredOption('-u, --username <string>')
    .option('-p, --password <string>')
    .requiredOption('-s, --subreddit <string>')
    .requiredOption('-r, --reddit-username <string>');

  program.parse();

  const options = program.opts();
  console.log(options);

  let password;
  if (!('password' in options)) {
    password = await passwordPrompt('Lemmy password (hidden, not stored anywhere): ', {
      method: "hide"
    });
  }
  else {
    password = options.password;
  }

  let client = new LemmyHttp(options.instanceUrl);
  let loginForm = {
    username_or_email: options.username,
    password,
  };
  let jwt = await client.login(loginForm).jwt;
}

main();