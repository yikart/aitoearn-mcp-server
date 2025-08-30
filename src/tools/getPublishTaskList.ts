import { server } from "../server.js";
import { z } from "zod";
import { apiGetPublistTaskList } from "../api.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export default function init() {
    server.tool(
        "get-publish-task-list",
        {
            skKey: z.string().describe("Secret key (API key) for account authentication"),
            flowId: z.string().describe("flowId"),
        },
        {
            title: "get publish task list",
            description: "get publish task list by flowId",
            inputSchema: {
                type: "object",
                properties: {
                    skKey: { type: "string", description: "Authentication API key" },
                    flowId: { type: "flowId", description: "publish list flowId" },
                },
                required: ['flowId', 'skKey']
            }
        },
        async (data) => {
            const resContent: CallToolResult = {
                content: [],
            };
            const taskList = await apiGetPublistTaskList(data.skKey, data.flowId);
            taskList.forEach(element => {
                const statusStr = element.status === 1 ? '成功' : element.status === -1 ? '失败' : '进行中';
                resContent.content.push({
                    type: "text",
                    text: `账号ID：${element.accountId} - 状态：${statusStr} - 错误信息：${element.errorMsg}`,
                });
            });
            return resContent
        },
    );
}