import * as core from '@actions/core';
import * as github from '@actions/github';

const run = async function (): Promise<void> {
  try {
    const home = core.getInput('home');

    // A const project = core.getInput('project');
    // A const column = core.getInput('column');

    core.info('Setting up Octokit');
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);

    const splittedHome = home.split('/');

    core.info('Searching project');
    let dat1;

    switch (splittedHome[0]) {
      case 'users': {
        dat1 = await octokit.rest.projects.listForUser({
          username: splittedHome[1]
        });
        break;
      }
      case 'repos': {
        dat1 = await octokit.rest.projects.listForRepo({
          owner: splittedHome[1],
          repo: splittedHome[2]
        });
        break;
      }
      case 'orgs': {
        dat1 = octokit.rest.projects.listForOrg({
          org: splittedHome[1]
        });
        break;
      }
      default: {
        throw new Error(
          'The home argument must be one of users/{users}, repos/{owner}/{repo} or orgs/{org}'
        );
      }
    }
    core.debug(dat1);
  } catch (ex: any) {
    core.setFailed(ex.message);
  }
};

run();
