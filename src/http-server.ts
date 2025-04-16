// src/http-server.ts
import express from 'express';
import dotenv from 'dotenv';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { GitHubMcpServer } from './server.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure GitHub client options
const githubOptions = {
  type: (process.env.GITHUB_TYPE || 'cloud') as 'cloud' | 'enterprise',
  token: process.env.GITHUB_TOKEN || '',
  baseUrl: process.env.GITHUB_BASE_URL
};

// Create server
const mcpServer = new GitHubMcpServer({ github: githubOptions });

// SSE transports for multiple connections
const transports: {[sessionId: string]: SSEServerTransport} = {};

app.get("/sse", async (_, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await mcpServer.start(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(port, () => {
  console.log(`GitHub Actions MCP HTTP server running on port ${port}`);
});