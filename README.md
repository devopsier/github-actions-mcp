# GitHub Actions MCP Server

This repository contains the implementation of a Model Context Protocol (MCP) server for managing GitHub Actions workflows and resources. The server is designed to interact with GitHub repositories and provide tools, resources, and prompts for automating and managing workflows.

## Features
- **Resource Management**: Fetch and manage GitHub repositories and workflows.
- **Tool Execution**: Trigger workflows and manage GitHub Actions tools.
- **Prompt Generation**: Create issues, review pull requests, and more.

## Project Structure
```
/app/github-actions-mcp-server
├── Dockerfile
├── package.json
├── tsconfig.json
├── src/
│   ├── http-server.ts
│   ├── server.backup.ts
│   ├── server.ts
│   ├── stdio-server.ts
│   ├── github/
│   │   └── client.ts
│   └── utils/
│       └── utils.ts
```

## Prerequisites
- Docker
- Node.js (v16 or later)
- GitHub Personal Access Token (PAT) with appropriate permissions

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/devopsier/github-actions-mcp.git
   cd github-actions-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the Docker image:
   ```bash
   docker build -t github-actions-mcp .
   ```

4. Run the server:
   ```bash
   docker run -i --rm -e GITHUB_TOKEN=<your_github_token> -e GITHUB_TYPE=cloud github-actions-mcp
   ```

## Configuration
The server can be configured using the `settings.json` file in your VS Code workspace. Example:
```json
"mcp": {
    "servers": {
        "mcp-github-actions": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "-e",
                "GITHUB_TOKEN",
                "-e",
                "GITHUB_TYPE",
                "github-actions-mcp"
            ],
            "env": {
                "GITHUB_TOKEN": "<your_github_token>",
                "GITHUB_TYPE": "cloud"
            }
        }
    }
}
```

## Contributing

We welcome contributions to the GitHub Actions MCP Server project! To contribute, please follow these steps:

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes and commit them with clear and concise messages.
4. Push your branch to your forked repository:
   ```bash
   git push origin my-feature-branch
   ```
5. Open a pull request to the main repository and provide a detailed description of your changes.

For more details, see the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.