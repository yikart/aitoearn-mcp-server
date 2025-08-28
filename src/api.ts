import { NewPublishData } from "./common.js";

// const BASE_URL = 'https://mcp.aitoearn.ai';
const BASE_URL = 'https://mcp.dev.aitoearn.ai';

/**
 * 获取账号列表
 * @param skKey 
 * @returns 
 */
export async function getAccountList(skKey: string): Promise<NewPublishData[] | null> {
    try {
        const response = await fetch(`${BASE_URL}/plugin/account/list`, {
            method: 'GET',
            headers: {
                'sk-key': `${skKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch account list: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.accounts || [];
    } catch (error) {
        console.error('Error fetching account list:', error);
        throw error;
    }
}

// 进行某个账号的发布
export async function publishCreate(skKey: string, newData: NewPublishData) {
    try {
        const response = await fetch(`${BASE_URL}/plugin/publish/create`, {
            method: 'POST',
            headers: {
                'sk-key': `${skKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });

        if (!response.ok) {
            throw new Error(`Failed to create publish: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating publish:', error);
        throw error;
    }
}
