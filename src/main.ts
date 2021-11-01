import * as core from '@actions/core';
import * as github from '@actions/github';

const getIdOfUserProject = async function (
  octokit: any,
  username: string,
  name: string
): Promise<number> {
  let i = 1;

  core.debug(`for loop iteration ${i}`);
  for (;;) {
    if (i === 2) {
      return 0;
    }
    const { data: projects } = await octokit.rest.projects.listForUser({
      username,
      per_page: 5,
      page: i
    });

    core.debug(JSON.stringify(projects));
    if (projects.length === 0) {
      return 0;
    }
    for (const proj of projects) {
      if (proj.name === name) {
        return proj.id;
      }
    }
    i += 1;
  }
};

const getIdOfRepoProject = async function (
  octokit: any,
  owner: string,
  repo: string,
  name: string
): Promise<number> {
  let i = 1;

  core.debug(`for loop iteration ${i}`);
  for (;;) {
    if (i === 2) {
      return 0;
    }
    const { data: projects } = await octokit.rest.projects.listForRepo({
      owner,
      repo,
      per_page: 5,
      page: i
    });

    core.debug(JSON.stringify(projects));
    if (projects.length === 0) {
      return 0;
    }
    for (const proj of projects) {
      if (proj.name === name) {
        return proj.id;
      }
    }
    i += 1;
  }
};

const getIdOfOrgProject = async function (
  octokit: any,
  org: string,
  name: string
): Promise<number> {
  let i = 1;

  core.debug(`for loop iteration ${i}`);
  for (;;) {
    if (i === 2) {
      return 0;
    }
    const { data: projects } = await octokit.rest.projects.listForOrg({
      org,
      per_page: 5,
      page: i
    });

    core.debug(JSON.stringify(projects));
    if (projects.length === 0) {
      return 0;
    }
    for (const proj of projects) {
      if (proj.name === name) {
        return proj.id;
      }
    }
    i += 1;
  }
};

const run = async function (): Promise<void> {
  try {
    const home = core.getInput('home');

    core.info('Setting up Octokit');
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);
    const splittedHome = home.split('/');

    core.info('Searching project');
    const projectName = core.getInput('project');
    let projectId = 0;

    switch (splittedHome[0]) {
      case 'users': {
        projectId = await getIdOfUserProject(
          octokit,
          splittedHome[1],
          projectName
        );
        break;
      }
      case 'repos': {
        projectId = await getIdOfRepoProject(
          octokit,
          splittedHome[1],
          splittedHome[2],
          projectName
        );
        break;
      }
      case 'orgs': {
        projectId = await getIdOfOrgProject(
          octokit,
          splittedHome[1],
          projectName
        );
        break;
      }
      default: {
        throw new Error(
          'The home argument must be one of users/{users}, repos/{owner}/{repo} or orgs/{org}'
        );
      }
    }

    core.info(`Project ID for ${projectName} is ${projectId}`);
    if (projectId === 0) {
      throw new Error(
        `Could not find a project named ${projectName} in ${home}`
      );
    }

    const { data: columnData } = await octokit.rest.projects.listColumns({
      project_id: projectId
    });

    core.debug(JSON.stringify(columnData));
    const columnName = core.getInput('column');
    let columnId = 0;

    for (const col of columnData) {
      if (col.name === columnName) {
        columnId = col.id;
      }
    }

    core.info(`Column ID for ${columnName} is ${columnId}`);
    if (columnId === 0) {
      throw new Error(
        `Could not find a column named ${columnName} of project ${projectName} in ${home}`
      );
    }

    const response = octokit.rest.projects.createCard({
      column_id: columnId,
      note: null,
      content_id: github.context.payload.issue!.id,
      content_type: 'Issue'
    });

    core.debug(JSON.stringify(response));
  } catch (ex: any) {
    core.setFailed(ex.message);
  }
};

run();
