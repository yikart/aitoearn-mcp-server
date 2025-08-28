import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { apiGetAccountList } from "../api.js";


export default function init(server: McpServer) {
    /**
    * get-account-list
    * Get Account List
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
                const accountList = await apiGetAccountList(data.skKey);

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
                        text: `Account ID: ${account.accountId} | Type: ${account.accountType || ''}`,
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
}