# abca-testing

A testing repository for the AWS Bedrock Claude Agent (ABCA) integration. This repository serves as a sandbox for validating autonomous coding agent workflows, including Jira integration via the Atlassian MCP server.

## Overview

This repo is used to test and demonstrate:

- Autonomous background coding agents triggered by Jira issues
- MCP (Model Context Protocol) server integrations (e.g., Atlassian/Jira)
- End-to-end PR creation workflows driven by SCRUM tickets

## Project Structure

```
abca-testing/
├── README.md        # Project documentation
└── .mcp.json        # MCP server configuration (Jira integration)
```

## Setup

### Prerequisites

- Access to an Atlassian Jira workspace
- A valid `JIRA_API_TOKEN` environment variable (OAuth 2.0 token)

### Configuration

The `.mcp.json` file configures the Jira MCP server:

```json
{
  "mcpServers": {
    "jira-server": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/sse",
      "headers": {
        "Authorization": "Bearer ${JIRA_API_TOKEN}"
      }
    }
  }
}
```

Set your token before running any agent:

```bash
export JIRA_API_TOKEN=<your-oauth-token>
```

## Usage

This repository is primarily used as a target for autonomous agent runs. Agents are triggered by Jira tickets in the `SCRUM` project and automatically:

1. Read the ticket description
2. Make the requested code changes
3. Open a pull request linked to the Jira issue

## Contributing

Changes to this repo are typically made by automated agents. For manual contributions:

1. Create a new branch from `main`
2. Make your changes
3. Open a pull request with a descriptive title following the [Conventional Commits](https://www.conventionalcommits.org/) format

## License

See [LICENSE](./LICENSE) for details.
