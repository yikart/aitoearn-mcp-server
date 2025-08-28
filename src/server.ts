import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const server = new McpServer({
  name: "aitoearn-mcp",
  version: "1.0.0",
  description: "AiToEarn MCP Server - Provides social media publishing and account management capabilities for AI-driven content creation and automation",
  capabilities: {
    resources: {},
    tools: {
      "get-account-list": {
        description: "Retrieve list of accounts associated with an API key"
      },
      "create-publish": {
        description: "Create and publish content to a specific social media account"
      },
      "create-publish-list": {
        description: "Batch publish content to multiple accounts simultaneously"
      },
      "open-aitoearn-website": {
        description: "Open the AiToEarn platform website for account management and platform access"
      }
    },
  },
});
