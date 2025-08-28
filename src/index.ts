import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getAccountList, publishCreate } from "./api.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { PublishType } from "./common.js";
import { uuid } from "zod/v4";


const server = new McpServer({
  name: "aitoearn-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

/**
 * 获取账户列表
 * @param skKey 账号关联的skKey
 * @returns 账户列表
 */
server.tool(
  "get-account-list",
  {
    skKey: z.string().describe("账号关联的skKey"),
  },
  {
    title: "获取账户列表",
    description: "根据skKey获取关联的账户列表",
  },
  async (data) => {
    const accountList = await getAccountList(data.skKey);

    if (!accountList) {
      return {
        content: [
          {
            type: "text",
            text: "未能检索账户数据",
          },
        ],
      };
    }

    if (accountList.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No accounts found for ${data.skKey}`,
          },
        ],
      };
    }

    const resContent: CallToolResult = {
      content: [],
    }

    for (const account of accountList) {
      resContent.content.push({
        type: "text",
        text: account.accountId,
      })
    }

    return resContent
  },
);

/**
 *  发布
 */
server.tool(
  "create-publish",
  {
    skKey: z.string().describe("账号关联的skKey"),
    accountId: z.string({ required_error: '账户ID' }).describe("账号ID"),
    type: z.nativeEnum(PublishType, { required_error: '类型' }).describe("类型"),
    title: z.string().describe("标题"),
    desc: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("描述"),
    videoUrl: z.string().nullable().optional().transform(val => !val ? undefined : val),
    coverUrl: z.string().describe("封面"),
    imgUrlList: z.string().nullable().optional().transform(val => !val ? undefined : val.split(',')),
    publishTime: z.string().nullable().optional().transform(val => !val ? undefined : val),
    topics: z.string(),
  },
  {
    title: "创建发布",
    description: "根据经纬度创建发布内容",
  },
  async (data) => {
    // Conditional validation based on type
    if (data.type === PublishType.VIDEO && !data.videoUrl) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: VIDEO类型需要提供videoUrl",
          },
        ],
      };
    }
    
    if (data.type === PublishType.ARTICLE && !data.imgUrlList) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: ARTICLE类型需要提供imgUrlList",
          },
        ],
      };
    }

    const flowId = `mcp_${uuid()}`
    const res = await publishCreate(data.skKey, {
      flowId,
      ...data
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Created publish result: ${res}`,
        }
      ],
    };
  },
);

server.tool(
  "create-publish-list",
  {
    skKey: z.string().describe("账号关联的skKey"),
    type: z.nativeEnum(PublishType, { required_error: '类型' }).describe("类型"),
    title: z.string().describe("标题"),
    desc: z.string().nullable().optional().transform(val => !val ? undefined : val).describe("描述"),
    videoUrl: z.string().nullable().optional().transform(val => !val ? undefined : val),
    coverUrl: z.string().describe("封面"),
    imgUrlList: z.string().nullable().optional().transform(val => !val ? undefined : val.split(',')),
    publishTime: z.string().nullable().optional().transform(val => !val ? undefined : val),
    topics: z.string(),
  },
  {
    title: "创建发布",
    description: "根据skKey批量发布",
  },
  async (data) => {
    // Conditional validation based on type
    if (data.type === PublishType.VIDEO && !data.videoUrl) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: VIDEO类型需要提供videoUrl",
          },
        ],
      };
    }
    
    if (data.type === PublishType.ARTICLE && !data.imgUrlList) {
      return {
        content: [
          {
            type: "text",
            text: "ERROR: ARTICLE类型需要提供imgUrlList",
          },
        ],
      };
    }

    const accountList = await getAccountList(data.skKey);

    if (!accountList) {
      return {
        content: [
          {
            type: "text",
            text: "未能检索账户数据",
          },
        ],
      };
    }

    const resContent: CallToolResult = {
      content: [
        {
          type: "text",
          text: "开始发布",
        },
      ],
    }

    let index = 1;
    for (const account of accountList) {
      const flowId = `mcp_${index += 1}_${uuid()}`
      const ret = await publishCreate(data.skKey, { flowId, accountId: account.accountId, ...data });
      resContent.content.push({
        type: "text",
        text: `${account.title} 发布结果: ${ret.message}`,
      });
    }

    return {
      content: [
        {
          type: "text",
          text: `Created publish for location: ${1}`,
        }
      ],
    };
  },
);


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AiToEarn MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});