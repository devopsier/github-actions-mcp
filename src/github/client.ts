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

    async getWorkflow(owner: string, repo: string, workflowId: string) {
        const { data } = await this.octokit.rest.actions.getWorkflow({
            owner,
            repo,
            workflow_id: workflowId
        });
        return data;
    }

    async triggerWorkflow(owner: string, repo: string, workflowId: string, ref: string, inputs?: Record<string, any>) {
        const { data } = await this.octokit.rest.actions.createWorkflowDispatch({
            owner,
            repo,
            workflow_id: workflowId,
            ref,
            inputs
        });
        return data;
    }

    async listWorkflowRuns(owner: string, repo: string, workflowId: string) {
        const { data } = await this.octokit.rest.actions.listWorkflowRuns({
            owner,
            repo,
            workflow_id: workflowId
        });
        return data;
    }

    async getWorkflowRun(owner: string, repo: string, runId: number) {
        const { data } = await this.octokit.rest.actions.getWorkflowRun({
            owner,
            repo,
            run_id: runId
        });
        return data;
    }

    async cancelWorkflowRun(owner: string, repo: string, runId: number) {
        const { status } = await this.octokit.rest.actions.cancelWorkflowRun({
            owner,
            repo,
            run_id: runId
        });
        return status === 202; // Returns true if the cancellation was successful
    }

    async rerunWorkflow(owner: string, repo: string, runId: number) {
        const { status } = await this.octokit.rest.actions.reRunWorkflow({
            owner,
            repo,
            run_id: runId
        });
        return status === 201; // Returns true if the rerun was successful
    }

    async deleteWorkflowRun(owner: string, repo: string, runId: number) {
        const { status } = await this.octokit.rest.actions.deleteWorkflowRun({
            owner,
            repo,
            run_id: runId
        });
        return status === 204; // Returns true if the deletion was successful
    }

    async downloadWorkflowRunLogs(owner: string, repo: string, runId: number) {
        const { url } = await this.octokit.rest.actions.downloadWorkflowRunLogs({
            owner,
            repo,
            run_id: runId
        });
        return url; // Returns the URL to download the logs
    }

    async deleteWorkflowRunLogs(owner: string, repo: string, runId: number) {
        const { status } = await this.octokit.rest.actions.deleteWorkflowRunLogs({
            owner,
            repo,
            run_id: runId
        });
        return status === 204; // Returns true if the logs were successfully deleted
    }

    async getWorkflowRunLogs(owner: string, repo: string, runId: number): Promise<string> {
        const { data } = await this.octokit.rest.actions.downloadWorkflowRunLogs({
            owner,
            repo,
            run_id: runId
        });
        return data as string; // Casts the logs content to string
    }

    // Add more GitHub API methods as needed
}