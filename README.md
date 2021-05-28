![CI/CD](https://github.com/cb80/add2project/workflows/CI/CD/badge.svg)

# Description

This action can add issues and pull requests to a project. It supports GitHub Enterprise.

# Examples

Add new pull requests to a project in the same repository:
```
on:
  pull_request:
    types: [opened]
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
    - uses: cb80/add2project@latest
      with:
        project: {project name}
        column: {column name}
```

Add new issues to a user project:
```
on:
  issues:
    types: [opened]
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
    - uses: cb80/add2project@latest
      with:
        home: users/{user name}
        project: {project name}
        column: {column name}
        token: ${{ secrets.MY_TOKEN }}
```

Add new issues to an organization project:
```
on:
  issues:
    types: [opened]
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
    - uses: cb80/add2project@latest
      with:
        home: orgs/{organization name}
        project: {project name}
        column: {column name}
        token: ${{ secrets.MY_TOKEN }}
```

# Inputs

| Option    | Use                                          | Default                | Description |
|-----------|----------------------------------------------|------------------------|-------------|
| `project` | mandatory                                    |                        | The name of the project. |
| `column`  | mandatory                                    |                        | The name of the column. |
| `home`    | optional for projects in the same repository | `github.repository`    | The home where the repository lives. |
| `token`   | optional for projects in the same repository | `secrets.GITHUB_TOKEN` | The token for authentication and authorization. |

# Credits

This action is inspired by the official [typescript action template][tstpl].

[tstpl]: https://github.com/actions/typescript-action
