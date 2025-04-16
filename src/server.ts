// src/server.ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitHubClient, GitHubClientOptions } from "./github/client.js";
import { ensureString } from './utils/utils.js';

export interface GitHubMcpServerOptions {
    github: GitHubClientOptions;
}

export class GitHubMcpServer {
    private server: McpServer;
    private githubClient: GitHubClient;

    constructor(options: GitHubMcpServerOptions) {
        this.server = new McpServer({
            name: "GitHub Actions MCP",
            version: "1.0.0",
            capabilities: {
                tools: {},
                resources: {},
            },
        });

        this.githubClient = new GitHubClient(options.github);
        this.registerTools();
    }

    private registerTools() {

        this.server.tool(
            "list-repositories",
            "List repositories for a user or organization",
            {
                owner: z.string()
            },
            async ({ owner }) => {
                try {
                    owner = ensureString(owner);
                    const repositories = await this.githubClient.listRepositories(owner);
                    return {
                        content: [{
                            type: "text",
                            text: `Repositories for ${owner}: ${repositories.map(repo => repo.name).join(", ")}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error listing repositories for ${owner}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error listing repositories for ${owner}`
                        }],
                        isError: true
                    };
                }
            }
        );

        // Trigger workflow tool
        this.server.tool(
            "trigger-workflow",
            "Trigger a GitHub Actions workflow",
            {
                owner: z.string(),
                repo: z.string(),
                workflowId: z.string(),
                ref: z.string()
            },
            async ({ owner, repo, workflowId, ref }) => {
                try {
                    await this.githubClient.triggerWorkflow(owner, repo, workflowId, ref);
                    return {
                        content: [{
                            type: "text",
                            text: `Workflow ${workflowId} triggered successfully on ${ref}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error triggering workflow ${workflowId} in ${owner}/${repo}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error triggering workflow ${workflowId} in ${owner}/${repo}`
                        }],
                        isError: true
                    };
                }
            }
        );
    }

    async start(transport: any) {
        await this.server.connect(transport);
        console.log("GitHub Actions MCP Server started");
        return this.server;
    }
}