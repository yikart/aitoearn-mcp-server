import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";
import initTools from "./tools/index.js";
import initPrompts from "./prompts/index.js";

// Initialize tools
initTools()
initPrompts()

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
