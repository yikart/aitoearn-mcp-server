import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import initGetAccountList from "./tools/getAccountList.js";
import initCreatePublish from "./tools/createPublish.js";
import initCreatePublishList from "./tools/createPublishList.js";
import initOpenAitoearnWebsite from "./tools/openAitoearnWebsite.js";


const server = new McpServer({
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

// Initialize tools
initGetAccountList(server)  
initCreatePublish(server)
initCreatePublishList(server)
initOpenAitoearnWebsite(server)

// run
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("AiToEarn MCP running on stdio");
  } catch (error) {
    console.error("AiToEarn MCP error:", error);
  }

}
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
