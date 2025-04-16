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

        this.server.tool(
            "get-workflows",
            "List workflows for a specific repository",
            {
                owner: z.string(),
                repo: z.string()
            },
            async ({ owner, repo }) => {
                try {
                    owner = ensureString(owner);
                    repo = ensureString(repo);
                    const workflows = await this.githubClient.getWorkflows(owner, repo);
                    return {
                        content: [{
                            type: "text",
                            text: `Workflows for ${owner}/${repo}: ${workflows.workflows.map(workflow => workflow.name).join(", ")}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error listing workflows for ${owner}/${repo}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error listing workflows for ${owner}/${repo}`
                        }],
                        isError: true
                    };
                }
            }
        );

        this.server.tool(
            "get-repository",
            "Get details of a specific repository",
            {
                owner: z.string(),
                repo: z.string()
            },
            async ({ owner, repo }) => {
                try {
                    owner = ensureString(owner);
                    repo = ensureString(repo);
                    const repository = await this.githubClient.getRepository(owner, repo);
                    return {
                        content: [{
                            type: "text",
                            text: `Repository ${owner}/${repo} details: ${JSON.stringify(repository, null, 2)}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error fetching repository ${owner}/${repo}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error fetching repository ${owner}/${repo}`
                        }],
                        isError: true
                    };
                }
            }
        );

        this.server.tool(
            "get-workflow",
            "Get details of a specific workflow",
            {
                owner: z.string(),
                repo: z.string(),
                workflowId: z.string()
            },
            async ({ owner, repo, workflowId }) => {
                try {
                    owner = ensureString(owner);
                    repo = ensureString(repo);
                    const workflow = await this.githubClient.getWorkflow(owner, repo, workflowId);
                    return {
                        content: [{
                            type: "text",
                            text: `Workflow ${workflowId} details: ${JSON.stringify(workflow, null, 2)}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error fetching workflow ${workflowId} in ${owner}/${repo}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error fetching workflow ${workflowId} in ${owner}/${repo}`
                        }],
                        isError: true
                    };
                }
            }
        );

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

        this.server.tool(
            "list-workflow-runs",
            "List workflow runs for a specific workflow",
            {
                owner: z.string(),
                repo: z.string(),
                workflowId: z.string()
            },
            async ({ owner, repo, workflowId }) => {
                try {
                    const runs = await this.githubClient.listWorkflowRuns(owner, repo, workflowId);
                    return {
                        content: [{
                            type: "text",
                            text: `Workflow runs for ${workflowId}: ${runs.workflow_runs.map(run => run.id).join(", ")}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error listing workflow runs for ${workflowId} in ${owner}/${repo}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error listing workflow runs for ${workflowId} in ${owner}/${repo}`
                        }],
                        isError: true
                    };
                }
            }
        );

        this.server.tool(
            "get-workflow-run-logs",
            "Retrieve logs for a specific workflow run",
            {
                owner: z.string(),
                repo: z.string(),
                runId: z.number()
            },
            async ({ owner, repo, runId }) => {
                try {
                    const logs = await this.githubClient.getWorkflowRunLogs(owner, repo, runId);
                    return {
                        content: [{
                            type: "text",
                            text: `Logs for workflow run ${runId}: ${logs}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error retrieving logs for workflow run ${runId} in ${owner}/${repo}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error retrieving logs for workflow run ${runId} in ${owner}/${repo}`
                        }],
                        isError: true
                    };
                }
            }
        );

        this.server.tool(
            "cancel-workflow-run",
            "Cancel a specific workflow run",
            {
                owner: z.string(),
                repo: z.string(),
                runId: z.number()
            },
            async ({ owner, repo, runId }) => {
                try {
                    const success = await this.githubClient.cancelWorkflowRun(owner, repo, runId);
                    return {
                        content: [{
                            type: "text",
                            text: success
                                ? `Workflow run ${runId} canceled successfully`
                                : `Failed to cancel workflow run ${runId}`
                        }]
                    };
                } catch (error) {
                    console.error(`Error canceling workflow run ${runId} in ${owner}/${repo}:`, error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error canceling workflow run ${runId} in ${owner}/${repo}`
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