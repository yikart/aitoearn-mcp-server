import { server } from "../server.js";

export default function init() {
    /**
     * Open AiToEarn Website Tool
     * Provides instructions and URL to open the AiToEarn platform
     */
    server.tool(
        "open-aitoearn-website",
        {},
        {
            title: "Open AiToEarn Website",
            description: "Open the AiToEarn platform website (https://aitoearn.ai) for account management, content creation, and platform access.",
            inputSchema: {
                type: "object",
                properties: {},
                required: []
            }
        },
        async () => {
            return {
                content: [
                    {
                        type: "text",
                        text: "🌐 Opening AiToEarn Platform\n\n" +
                            "🔗 Website: https://aitoearn.ai\n\n" +
                            "✨ Features available on the platform:\n" +
                            "• Account management and configuration\n" +
                            "• Content creation and scheduling\n" +
                            "• Analytics and performance tracking\n" +
                            "• API key management\n" +
                            "• Social media account integration\n\n" +
                            "💡 Tip: Use this platform to manage your social media accounts and generate API keys for use with this MCP server.",
                    },
                ],
            };
        },
    );
}