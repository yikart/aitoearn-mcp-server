import { server } from "../server.js";

export default function init() {
    server.tool(
        "get-skKey",
        {},
        {
            title: "获取密钥skKey",
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
                        text: "open web https://aitoearn.ai?type=skKey"
                    },
                ],
            };
        },
    );
}