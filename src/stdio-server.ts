// src/stdio-server.ts
import dotenv from 'dotenv';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GitHubMcpServer } from './server.js';

dotenv.config();

async function main() {
    // Configure GitHub client options
    const githubOptions = {
        type: (process.env.GITHUB_TYPE || 'cloud') as 'cloud' | 'enterprise',
        token: process.env.GITHUB_TOKEN || '',
        baseUrl: process.env.GITHUB_BASE_URL
    };

    // Create server
    const mcpServer = new GitHubMcpServer({ github: githubOptions });

    // Connect using stdio transport
    const transport = new StdioServerTransport();
    await mcpServer.start(transport);
}

main().catch(console.error);