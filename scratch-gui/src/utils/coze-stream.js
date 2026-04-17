// Coze 项目 ID，可在此处统一管理
export const DEFAULT_COZE_PROJECT_ID = "7629260602313211955";

// Coze接口（Coze 原生支持 CORS，可直接在浏览器/Electron 渲染进程中调用）
const COZE_STREAM_URL = "https://kwvtjz59xj.coze.site/stream_run";

/**
 *调用 Coze AI 接口
 * @param {string} queryText - 用户输入的问题
 * @param {{ sessionId: string, projectId?: string }} options
 * @param {(data: any) => void} onMessage - 每收到一条消息时的回调
 * @param {(error: any) => void} [onError] - 出错时的回调
 * @param {string} [apiToken] - Coze Personal Access Token，不传时从 process.env.COZE_API_TOKEN 读取
 */
export async function streamCoze(
    queryText,
    options,
    onMessage,
    onError,
    apiToken
) {
    const { sessionId, projectId } = options;
    const projectIdToUse = projectId || DEFAULT_COZE_PROJECT_ID;

    const payload = {
        content: {
            query: {
                prompt: [
                    {
                        type: "text",
                        content: { text: queryText },
                    },
                ],
            },
        },
        type: "query",
        session_id: sessionId,
        project_id: projectIdToUse,
    };

    // 优先用调用方传入的 token，其次读 webpack DefinePlugin 注入的环境变量
    const token = apiToken || process.env.COZE_API_TOKEN || "";

    let res;
    try {
        res = await fetch(COZE_STREAM_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        onError && onError(new Error("网络请求失败，请检查网络连接"));
        return;
    }

    if (!res.ok) {
        try {
            const errorData = await res.json();
            const errorMessage =
                errorData.message ||
                errorData.error ||
                `请求失败: ${res.status}`;
            onError && onError(new Error(errorMessage));
        } catch {
            onError &&
                onError(new Error(`请求失败: ${res.status} ${res.statusText}`));
        }
        return;
    }

    if (!res.body) {
        onError && onError(new Error("响应体为空"));
        return;
    }

    const reader = res.body.getReader();
    if (!reader) {
        onError && onError(new Error("无法获取数据读取器"));
        return;
    }

    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE 事件之间用 \n\n 分隔
            const blocks = buffer.split("\n\n");
            buffer = blocks.pop() || "";

            for (const block of blocks) {
                const dataLines = block
                    .split("\n")
                    .filter((line) => line.startsWith("data:"))
                    .map((line) => line.slice(5).trim());

                if (dataLines.length === 0) continue;

                const dataText = dataLines.join("\n");

                if (dataText === "[DONE]") {
                    return;
                }

                try {
                    const parsed = JSON.parse(dataText);
                    onMessage(parsed);
                } catch {
                    const textOnly = dataText
                        .replace(/\{[\s\S]*?\}/g, "")
                        .trim();
                    if (textOnly) {
                        onMessage(textOnly);
                    }
                }
            }
        }
    } catch (error) {
        onError && onError(error);
    } finally {
        reader.releaseLock();
    }
}

/**
 * 从 Coze 消息对象中提取增量文本
 * 根据 Coze 实际响应结构按需调整
 * @param {any} data - onMessage 收到的数据
 * @returns {string} 增量文本，无内容时返回空字符串
 */
export function extractCozeText(data) {
    if (typeof data === "string") return data;
    if (!data || typeof data !== "object") return "";

    // 常见 Coze 响应结构：{ type: "answer", content: { answer: "..." } }
    if (data.type === "answer" && data.content && data.content.answer) {
        return data.content.answer;
    }
    // 兼容其他可能的结构
    if (data.delta && typeof data.delta === "string") {
        return data.delta;
    }
    if (data.content && typeof data.content === "string") {
        return data.content;
    }
    return "";
}
