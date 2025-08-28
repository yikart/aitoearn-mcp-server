import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PublishType } from "../common.js";
import { apiPublishCreate } from "../api.js";
import { uuid } from "zod/v4";


export default function init(server: McpServer) {
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
                const res = await apiPublishCreate(data.skKey, {
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
}