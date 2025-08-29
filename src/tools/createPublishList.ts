import { z } from "zod";
import { PublishType } from "../common.js";
import { apiGetAccountList, apiPublishCreate } from "../api.js";
import { uuid } from "zod/v4";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { server } from "../server.js";


export default function init() {
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
            imgUrlList: z.string().optional().describe("Comma-separated list of image URLs (required for article type content)"),
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

                const flowId = `mcp_${uuid()}`;
                for (let i = 0; i < accountList.length; i++) {
                    const account = accountList[i];
                    try {
                        await apiPublishCreate(data.skKey, {
                            flowId,
                            accountId: account.accountId,
                            ...data
                        });

                        resContent.content.push({
                            type: "text",
                            text: `SUCCESS: ${account.accountType} - ${account.accountId} - Published successfully (Flow: ${flowId})`,
                        });
                        successCount++;
                    } catch (error) {
                        resContent.content.push({
                            type: "text",
                            text: `FAILED: ${account.accountType} - ${account.accountId} - ${error instanceof Error ? error.message : 'Unknown error'}`,
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
}