import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAccountList, publishCreate } from "./api.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { PublishType } from "./common.js";
import { uuid } from "zod/v4";


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
      }
    },
  },
});

/**
 * Get Account List Tool
 * Retrieves a list of social media accounts associated with the provided API key
 * @param skKey - The secret key associated with the user's account
 * @returns Array of account objects with account IDs and metadata
 */
server.tool(
  "get-account-list",
  {
    skKey: z.string().describe("Secret key (API key) associated with the user's account for authentication"),
  },
  {
    title: "Get Account List",
    description: "Retrieve a comprehensive list of social media accounts linked to the provided API key. Returns account IDs, titles, and associated metadata for content publishing operations.",
    inputSchema: {
      type: "object",
      properties: {
        skKey: {
          type: "string",
          description: "The secret key (API key) for account authentication"
        }
      },
      required: ["skKey"]
    }
  },
  async (data) => {
    try {
      const accountList = await getAccountList(data.skKey);

      if (!accountList) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Unable to retrieve account data. Please verify your API key and try again.",
            },
          ],
          isError: true,
        };
      }

      if (accountList.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No accounts found for the provided API key: ${data.skKey}. Please ensure you have accounts linked to this key.`,
            },
          ],
        };
      }

      const resContent: CallToolResult = {
        content: [
          {
            type: "text",
            text: `Found ${accountList.length} account(s):`,
          },
        ],
      };

      for (const account of accountList) {
        resContent.content.push({
          type: "text",
          text: `Account ID: ${account.accountId} | Title: ${account.title || 'N/A'}`,
        });
      }

      return resContent;
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving account list: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
        isError: true,
      };
    }
  },
);

/**
 * Create Publish Tool
 * Creates and publishes content to a specific social media account
 * Supports both video content (requires videoUrl) and article content (requires imgUrlList)
 */
server.tool(
  "create-publish",
  {
    skKey: z.string().describe("Secret key (API key) for account authentication"),
    accountId: z.string({ required_error: 'Account ID is required' }).describe("Target social media account ID for publishing"),
    type: z.nativeEnum(PublishType, { required_error: 'Content type is required' }).describe("Content type: 'video' for video content or 'article' for article content"),
    title: z.string().describe("Title or headline for the published content"),
    desc: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("Optional description or caption for the content"),
    videoUrl: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("Video file URL (required for video type content)"),
    coverUrl: z.string().describe("Cover image URL for the content thumbnail"),
    imgUrlList: z.string().nullable().optional().transform(val => !val ? undefined : val.split(',')).describe("Comma-separated list of image URLs (required for article type content)"),
    publishTime: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("Optional scheduled publish time in format 'YYYY-MM-DD HH:mm:ss'"),
    topics: z.string().describe("Comma-separated list of topics or hashtags for content categorization"),
  },
  {
    title: "Create Content Publication",
    description: "Create and publish content to a specific social media account. Supports video content (requires videoUrl) and article content (requires imgUrlList). Validates content type requirements automatically.",
    inputSchema: {
      type: "object",
      properties: {
        skKey: { type: "string", description: "Authentication API key" },
        accountId: { type: "string", description: "Target account ID" },
        type: { type: "string", enum: ["video", "article"], description: "Content type" },
        title: { type: "string", description: "Content title" },
        desc: { type: "string", description: "Content description" },
        videoUrl: { type: "string", description: "Video URL (required for video type)" },
        coverUrl: { type: "string", description: "Cover image URL" },
        imgUrlList: { type: "string", description: "Comma-separated image URLs (required for article type)" },
        publishTime: { type: "string", description: "Scheduled publish time" },
        topics: { type: "string", description: "Topics and hashtags" }
      },
      required: ["skKey", "accountId", "type", "title", "coverUrl", "topics"]
    }
  },
  async (data) => {
    try {
      // Conditional validation based on type
      if (data.type === PublishType.VIDEO && !data.videoUrl) {
        return {
          content: [
            {
              type: "text",
              text: "Validation Error: VIDEO content type requires a valid videoUrl parameter. Please provide the video file URL.",
            },
          ],
          isError: true,
        };
      }
      
      if (data.type === PublishType.ARTICLE && !data.imgUrlList) {
        return {
          content: [
            {
              type: "text",
              text: "Validation Error: ARTICLE content type requires imgUrlList parameter. Please provide a comma-separated list of image URLs.",
            },
          ],
          isError: true,
        };
      }

      const flowId = `mcp_${uuid()}`;
      const res = await publishCreate(data.skKey, {
        flowId,
        ...data
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Content published successfully! Flow ID: ${flowId}. Result: ${JSON.stringify(res)}`,
          }
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating publication: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
        isError: true,
      };
    }
  },
);

/**
 * Batch Publish Tool
 * Creates and publishes the same content to multiple social media accounts simultaneously
 * Automatically retrieves all accounts associated with the API key and publishes to each
 */
server.tool(
  "create-publish-list",
  {
    skKey: z.string().describe("Secret key (API key) for account authentication"),
    type: z.nativeEnum(PublishType, { required_error: 'Content type is required' }).describe("Content type: 'video' for video content or 'article' for article content"),
    title: z.string().describe("Title or headline for the published content"),
    desc: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("Optional description or caption for the content"),
    videoUrl: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("Video file URL (required for video type content)"),
    coverUrl: z.string().describe("Cover image URL for the content thumbnail"),
    imgUrlList: z.string().nullable().optional().transform(val => !val ? undefined : val.split(',')).describe("Comma-separated list of image URLs (required for article type content)"),
    publishTime: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("Optional scheduled publish time in format 'YYYY-MM-DD HH:mm:ss'"),
    topics: z.string().describe("Comma-separated list of topics or hashtags for content categorization"),
  },
  {
    title: "Batch Content Publication",
    description: "Create and publish the same content to all social media accounts associated with the provided API key. Performs bulk publishing operation with individual success/failure reporting for each account.",
    inputSchema: {
      type: "object",
      properties: {
        skKey: { type: "string", description: "Authentication API key" },
        type: { type: "string", enum: ["video", "article"], description: "Content type" },
        title: { type: "string", description: "Content title" },
        desc: { type: "string", description: "Content description" },
        videoUrl: { type: "string", description: "Video URL (required for video type)" },
        coverUrl: { type: "string", description: "Cover image URL" },
        imgUrlList: { type: "string", description: "Comma-separated image URLs (required for article type)" },
        publishTime: { type: "string", description: "Scheduled publish time" },
        topics: { type: "string", description: "Topics and hashtags" }
      },
      required: ["skKey", "type", "title", "coverUrl", "topics"]
    }
  },
  async (data) => {
    try {
      // Conditional validation based on type
      if (data.type === PublishType.VIDEO && !data.videoUrl) {
        return {
          content: [
            {
              type: "text",
              text: "Validation Error: VIDEO content type requires a valid videoUrl parameter. Please provide the video file URL.",
            },
          ],
          isError: true,
        };
      }
      
      if (data.type === PublishType.ARTICLE && !data.imgUrlList) {
        return {
          content: [
            {
              type: "text",
              text: "Validation Error: ARTICLE content type requires imgUrlList parameter. Please provide a comma-separated list of image URLs.",
            },
          ],
          isError: true,
        };
      }

      const accountList = await getAccountList(data.skKey);

      if (!accountList) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Unable to retrieve account data. Please verify your API key and try again.",
            },
          ],
          isError: true,
        };
      }

      if (accountList.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No accounts found for the provided API key. Please ensure you have accounts linked to this key.",
            },
          ],
        };
      }

      const resContent: CallToolResult = {
        content: [
          {
            type: "text",
            text: `Starting batch publication to ${accountList.length} account(s)...`,
          },
        ],
      };

      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < accountList.length; i++) {
        const account = accountList[i];
        try {
          const flowId = `mcp_batch_${i + 1}_${uuid()}`;
          await publishCreate(data.skKey, { 
            flowId, 
            accountId: account.accountId, 
            ...data 
          });
          
          resContent.content.push({
            type: "text",
            text: `SUCCESS: ${account.title || account.accountId} - Published successfully (Flow: ${flowId})`,
          });
          successCount++;
        } catch (error) {
          resContent.content.push({
            type: "text",
            text: `FAILED: ${account.title || account.accountId} - ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
          failureCount++;
        }
      }

      resContent.content.push({
        type: "text",
        text: `Batch publication completed. Success: ${successCount}, Failed: ${failureCount}`,
      });

      return resContent;
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error during batch publication: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
        isError: true,
      };
    }
  },
);


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AiToEarn MCP running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});