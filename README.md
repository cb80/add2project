![CI/CD](https://github.com/cb80/add2project/workflows/CI/CD/badge.svg)

# Description

This action can add issues to a project. It supports GitHub Enterprise.

# Example

```
on:
  issues:
    types: [opened]

jobs:
  main:
    runs-on: ubuntu-latest
    steps:

    - name: Add issue to a project in the same repository
      uses: cb80/add2project@latest
      with:
        project: {project name}
        column: {column name}

    - name: Add issue to a user project
      uses: cb80/add2project@latest
      with:
        home: users/{user name}
        project: {project name}
        column: {column name}
        # you need a dedicated token with scope repo
        token: ${{ secrets.PROJECT_TOKEN }}

    - name: Add issue to an organization project
      uses: cb80/add2project@latest
      with:
        home: orgs/{organization name}
        project: {project name}
        column: {column name}
        # you need a dedicated token with scope write:org
        token: ${{ secrets.PROJECT_TOKEN }}
```

# Inputs

| Option    | Use                                          | Default                        | Description |
|-----------|----------------------------------------------|--------------------------------|-------------|
| `project` | mandatory                                    |                                | The name of the project. |
| `column`  | mandatory                                    |                                | The name of the column. |
| `home`    | optional for projects in the same repository | `repos/${{github.repository}}` | The home where the repository lives. |
| `token`   | optional for projects in the same repository | `${{secrets.GITHUB_TOKEN}}`    | The token for authentication and authorization. |

# Credits

This action is inspired by the official [typescript action template][tstpl].

[tstpl]: https://github.com/actions/typescript-action
