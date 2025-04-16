// src/github/client.ts
import { Octokit } from 'octokit';

export interface GitHubClientOptions {
    type: 'cloud' | 'enterprise';
    token: string;
    baseUrl?: string; // For enterprise
}

export class GitHubClient {
    private octokit: Octokit;

    constructor(options: GitHubClientOptions) {
        this.octokit = new Octokit({
            auth: options.token,
            ...(options.type === 'enterprise' && options.baseUrl
                ? { baseUrl: options.baseUrl }
                : {})
        });
    }

    async getRepository(owner: string, repo: string) {
        const { data } = await this.octokit.rest.repos.get({ owner, repo });
        return data;
    }

    async listRepositories(owner: string) {
        const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({ username: owner });
        return data;
    }

    async getWorkflows(owner: string, repo: string) {
        const { data } = await this.octokit.rest.actions.listRepoWorkflows({ owner, repo });
        return data;
    }

    async triggerWorkflow(owner: string, repo: string, workflowId: string, ref: string) {
        const { data } = await this.octokit.rest.actions.createWorkflowDispatch({
            owner,
            repo,
            workflow_id: workflowId,
            ref
        });
        return data;
    }

    // Add more GitHub API methods as needed
}