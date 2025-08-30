import { NewPublishData, SkKeyRefAccount, Task } from "./common.js";

const BASE_URL = 'https://mcp.aitoearn.ai';

/**
 * 获取账号列表
 * @param skKey 
 * @returns 
 */
export async function apiGetAccountList(skKey: string): Promise<SkKeyRefAccount[]> {
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

        const data: {
            data: SkKeyRefAccount[];
            code: number;
            message: string;
        } = await response.json();
        if (data.code) {
            throw new Error(`Failed to fetch account list: ${data.message}`);
        }
        return data.data || [];
    } catch (error) {
        console.error('Error fetching account list:', error);
        throw error;
    }
}

// 进行某个账号的发布
export async function apiPublishCreate(skKey: string, newData: NewPublishData) {
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

/**
 * 获取账号列表
 * @param skKey
 * @param flowId
 * @returns 
 */
export async function apiGetPublistTaskList(skKey: string, flowId: string): Promise<Task[]> {
    try {
        const response = await fetch(`${BASE_URL}/plugin/task/list/${flowId}`, {
            method: 'GET',
            headers: {
                'sk-key': `${skKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch account list: ${response.status} ${response.statusText}`);
        }

        const data: {
            data: Task[];
            code: number;
            message: string;
        } = await response.json();
        if (data.code) {
            throw new Error(`Failed to fetch account list: ${data.message}`);
        }
        return data.data || [];
    } catch (error) {
        console.error('Error fetching account list:', error);
        throw error;
    }
}