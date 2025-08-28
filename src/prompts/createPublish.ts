import { z } from "zod";
import { server } from "../server.js";
import { PublishType } from "../common.js";
export default function init() {
    const CodeReviewParams = {
        skKey: z.string().describe("Secret key (API key) for account authentication"),
        accountId: z.string({ required_error: 'Account ID is required' }).describe("Target social media account ID for publishing"),
        type: z.nativeEnum(PublishType, { required_error: 'Content type is required' }).describe("Content type: 'video' for video content or 'article' for article content"),
        title: z.string().describe("Title or headline for the published content"),
        desc: z.string().describe("Optional description or caption for the content"),
        videoUrl: z.string().describe("Video file URL (required for video type content)"),
        coverUrl: z.string().describe("Cover image URL for the content thumbnail"),
        imgUrlList: z.string().describe("Comma-separated list of image URLs (required for article type content)"),
        publishTime: z.string().describe("Optional scheduled publish time in format 'YYYY-MM-DD HH:mm:ss'"),
        topics: z.string().describe("Comma-separated list of topics or hashtags for content categorization"),
    };

    server.registerPrompt(
        "create-publish",
        {
            title: "create-publish",
            description: "create-publish",
            argsSchema: CodeReviewParams
        },
        ({ skKey }) => ({
            messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `${skKey}\n\n need`
                }
            }]
        })
    );

}