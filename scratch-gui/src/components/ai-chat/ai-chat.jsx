import React, { useRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ai-chat.css";
import {
    streamCoze,
    extractCozeText,
    getCozeFriendlyError,
} from "../../utils/coze-stream";
import { COZE_API_TOKEN } from "../../config/coze.config";
import CloseButton from "../../../static/IconAI/icon-close.svg";
const WIDTH_STORAGE_KEY = "aiChatPanelWidth";
const DEFAULT_PANEL_WIDTH = 480;
const MIN_PANEL_WIDTH = 360;
const MAX_PANEL_WIDTH = 720;
const STREAM_STATES = {
    IDLE: "idle",
    RECEIVING: "receiving",
    TOOL_RUNNING: "toolRunning",
    COMPLETED: "completed",
    FAILED: "failed",
};

const SENSITIVE_KEYS = [
    "token",
    "apiKey",
    "apikey",
    "secret",
    "password",
    "authorization",
    "accessKey",
    "privateKey",
    "credential",
    "cookie",
];

const LANGUAGE_TO_EXT = {
    javascript: "js",
    js: "js",
    typescript: "ts",
    ts: "ts",
    python: "py",
    py: "py",
    java: "java",
    c: "c",
    "c++": "cpp",
    cpp: "cpp",
    "c#": "cs",
    cs: "cs",
    go: "go",
    rust: "rs",
    rb: "rb",
    ruby: "rb",
    php: "php",
    html: "html",
    css: "css",
    json: "json",
    markdown: "md",
    md: "md",
};

const TOOL_NAME_MAP = {
    search_knowledge: "知识库检索",
};

function getExtFromLanguage(language) {
    const lang = (language || "").toLowerCase();
    return LANGUAGE_TO_EXT[lang] || "py";
}

const generateSessionId = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
};

function updateToolEntries(prevEntries, event) {
    const toolCallId = event?.tool?.toolCallId || `tool-${Date.now()}`;
    if (event.eventType === "tool_request") {
        const next = [...prevEntries];
        const index = next.findIndex((item) => item.toolCallId === toolCallId);
        const entry = {
            toolCallId,
            toolName: event?.tool?.toolName || "unknown_tool",
            parameters: event?.tool?.parameters || null,
            status: "pending",
            result: null,
            message: null,
            code: null,
        };
        if (index >= 0) {
            next[index] = { ...next[index], ...entry };
        } else {
            next.push(entry);
        }
        return next;
    }
    if (event.eventType === "tool_response") {
        const next = [...prevEntries];
        const index = next.findIndex((item) => item.toolCallId === toolCallId);
        const responseCode = event?.tool?.responseCode;
        const status =
            String(responseCode || "0") === "0" ? "success" : "error";
        const prevEntry = index >= 0 ? next[index] : null;
        const entry = {
            toolCallId,
            toolName:
                event?.tool?.toolName ||
                prevEntry?.toolName ||
                "unknown_tool",
            status,
            result: event?.tool?.responseResult || null,
            message: getCozeFriendlyError(
                responseCode,
                event?.tool?.responseMessage || null
            ),
            code: responseCode || null,
        };
        if (index >= 0) {
            next[index] = { ...next[index], ...entry };
        } else {
            next.push(entry);
        }
        return next;
    }
    return prevEntries;
}

function isSensitiveKey(key) {
    const keyText = String(key || "").toLowerCase();
    return SENSITIVE_KEYS.some((sensitiveKey) =>
        keyText.includes(String(sensitiveKey).toLowerCase())
    );
}

function maskString(value) {
    if (typeof value !== "string") return value;
    if (value.length <= 4) return "****";
    return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

function desensitizePayload(value) {
    if (Array.isArray(value)) {
        return value.map((item) => desensitizePayload(item));
    }
    if (value && typeof value === "object") {
        return Object.entries(value).reduce((acc, [key, val]) => {
            if (isSensitiveKey(key)) {
                acc[key] = maskString(String(val ?? ""));
            } else {
                acc[key] = desensitizePayload(val);
            }
            return acc;
        }, {});
    }
    return value;
}

function getReadableToolName(toolName) {
    const name = String(toolName || "").trim();
    if (!name) return "工具调用";
    return TOOL_NAME_MAP[name] || name;
}

function getToolQuery(parameters) {
    if (!parameters || typeof parameters !== "object") return "";
    if (typeof parameters.query === "string") return parameters.query;
    if (typeof parameters.search_query === "string") return parameters.search_query;
    const nested = parameters.search_knowledge;
    if (nested && typeof nested === "object" && typeof nested.query === "string") {
        return nested.query;
    }
    return "";
}

/**
 * AI聊天面板组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isAiChat - 控制面板是否显示
 * @param {Function} props.onSetAiChat - 设置面板显示状态的函数
 */
const AiChat = ({ isAiChat, onSetAiChat, onRunAiCode, peripheralName }) => {
    const panelRef = useRef(null);
    const messagesRef = useRef(null);
    const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH); //面板宽度
    const draggingRef = useRef(null); //拖拽内容
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "你好，我是AI助手，有什么可以帮你的吗？",
        },
    ]);
    const [inputValue, setInputValue] = useState(""); //输入框内容
    const [loading, setLoading] = useState(false);
    const [streamingText, setStreamingText] = useState(""); //流式回复文本
    const [streamingState, setStreamingState] = useState(STREAM_STATES.IDLE);
    const [streamingTools, setStreamingTools] = useState([]);
    const [toolExpandedMap, setToolExpandedMap] = useState({});
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [userScrolledUp, setUserScrolledUp] = useState(false); // 用户是否主动滚动上去
    const replyBufferRef = useRef(""); //回复缓冲区，用于存储流式回复的文本
    const sessionIdRef = useRef(generateSessionId());
    const sequenceBufferRef = useRef(new Map());
    const expectedSequenceRef = useRef(null);
    const streamFailedRef = useRef(false);
    const streamingToolsRef = useRef([]);
    const isScrollingProgrammaticallyRef = useRef(false); // 标记是否程序触发的滚动

    const copyTextToClipboard = useCallback(async (text) => {
        const value = typeof text === "string" ? text : String(text ?? "");
        if (!value) return;

        // 1) 优先走现代 API
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(value);
                return;
            }
        } catch {}

        // 2) 兜底：通过 textarea + execCommand
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-1000px";
        textarea.style.left = "-1000px";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
        } catch {}
        document.body.removeChild(textarea);
    }, []);

    const downloadText = useCallback((text, language) => {
        const value = typeof text === "string" ? text : String(text ?? "");
        const ext = getExtFromLanguage(language);
        const filename = `aicode.${ext}`;

        const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, []);

    // “运行代码”按钮的第一步：先把代码保存到主进程 ByteCode 目录
    const saveToByteCodeDir = useCallback(async (text, language) => {
        const value = typeof text === "string" ? text : String(text ?? "");
        if (!value) return { ok: false, error: "空代码" };

        const ext = getExtFromLanguage(language);
        const filename = `aicode.${ext}`;

        if (!window.myAPI?.ipcInvoke) {
            return { ok: false, error: "ipcInvoke 不可用" };
        }

        // 主进程里已注册: ipcMain.handle("ai-chat-save-code", ...)
        return await window.myAPI.ipcInvoke("ai-chat-save-code", {
            filename,
            content: value,
        });
    }, []);

    const MarkdownCodeBlock = useCallback(
        ({ node, children }) => {
            const codeEl = Array.isArray(children)
                ? children.find(
                      (c) => React.isValidElement(c) && c.type === "code"
                  )
                : children;

            const codeClassName =
                (codeEl && codeEl.props && codeEl.props.className) || "";
            const languageMatch = String(codeClassName).match(
                /language-([a-zA-Z0-9_-]+)/
            );
            const language = languageMatch ? languageMatch[1] : "python";
            const rawChildren =
                (codeEl && codeEl.props && codeEl.props.children) || "";
            const codeText = Array.isArray(rawChildren)
                ? rawChildren.join("")
                : String(rawChildren);

            const cleanText = codeText.replace(/\n$/, "");

            return (
                <div className={styles.codeBlock}>
                    <div className={styles.codeToolbar}>
                        <span className={styles.codeLang}>{language}</span>
                        <div className={styles.codeActions}>
                            <button
                                type="button"
                                className={styles.codeBtn}
                                onClick={() => copyTextToClipboard(cleanText)}
                            >
                                复制代码
                            </button>
                            <button
                                type="button"
                                className={styles.codeBtn}
                                onClick={() =>
                                    downloadText(cleanText, language)
                                }
                            >
                                下载代码
                            </button>
                            <button
                                type="button"
                                className={styles.codeBtn}
                                onClick={async () => {
                                    console.log(
                                        "[AI_CHAT][RUN_CODE] click run code",
                                        {
                                            language,
                                            codeLength: cleanText.length,
                                        }
                                    );
                                    const res = await saveToByteCodeDir(
                                        cleanText,
                                        language
                                    );
                                    if (!res || !res.ok) {
                                        console.error(
                                            "保存失败：",
                                            res?.error || res
                                        );
                                        return;
                                    }
                                    console.log(
                                        "[AI_CHAT][RUN_CODE] saved to ByteCode",
                                        res.path
                                    );

                                    if (!peripheralName) {
                                        console.warn(
                                            "设备未连接，无法下发代码"
                                        );
                                        return;
                                    }

                                    if (typeof onRunAiCode !== "function") {
                                        console.warn("onRunAiCode 未注入");
                                        return;
                                    }

                                    const runResult = await onRunAiCode({
                                        code: cleanText,
                                        language,
                                        isRun: true,
                                    });
                                    if (!runResult?.ok) {
                                        console.error(
                                            "AI代码下发失败：",
                                            runResult?.error
                                        );
                                    } else {
                                        console.log(
                                            "[AI_CHAT][RUN_CODE] upload done"
                                        );
                                    }
                                }}
                            >
                                运行代码
                            </button>
                        </div>
                    </div>

                    {/* 仍然用 <pre><code> 给现有 markdown 样式接上 */}
                    <pre className={styles.codePre}>
                        <code className={codeClassName}>{cleanText}</code>
                    </pre>
                </div>
            );
        },
        [
            copyTextToClipboard,
            downloadText,
            saveToByteCodeDir,
            peripheralName,
            onRunAiCode,
        ]
    );

    const renderMarkdown = useCallback(
        (text) => (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ ...props }) => (
                        <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                    pre: MarkdownCodeBlock,
                }}
            >
                {text}
            </ReactMarkdown>
        ),
        [MarkdownCodeBlock]
    );

    const setToolsWithRef = useCallback((updater) => {
        setStreamingTools((prev) => {
            const next =
                typeof updater === "function" ? updater(prev) : updater || [];
            streamingToolsRef.current = next;
            return next;
        });
    }, []);

    const applyStreamEvent = useCallback(
        (event) => {
            if (!event || streamFailedRef.current) return;
            const eventType = event.eventType;

            if (eventType === "message_start") {
                setStreamingState(STREAM_STATES.RECEIVING);
                return;
            }

            if (eventType === "tool_request" || eventType === "tool_response") {
                setToolsWithRef((prev) => updateToolEntries(prev, event));
                if (eventType === "tool_request") {
                    setStreamingState(STREAM_STATES.TOOL_RUNNING);
                }
            }

            if (eventType === "answer" || eventType === "text") {
                const chunk = extractCozeText(event);
                if (!chunk) return;
                replyBufferRef.current += chunk;
                setStreamingText(replyBufferRef.current);
                setStreamingState(STREAM_STATES.RECEIVING);
                return;
            }

            if (eventType === "error") {
                streamFailedRef.current = true;
                setStreamingState(STREAM_STATES.FAILED);
                const code = event?.error?.code || null;
                const message =
                    getCozeFriendlyError(code, event?.error?.message) ||
                    extractCozeText(event) ||
                    "请求失败，请稍后重试";
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: message },
                ]);
                return;
            }

            if (eventType === "message_end") {
                const endCode = event?.messageEnd?.code;
                if (endCode && String(endCode) !== "0") {
                    streamFailedRef.current = true;
                    setStreamingState(STREAM_STATES.FAILED);
                    const message =
                        getCozeFriendlyError(
                            endCode,
                            event?.messageEnd?.message || null
                        ) || "请求结束，但返回异常状态";
                    setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: message },
                    ]);
                    return;
                }
                setStreamingState(STREAM_STATES.COMPLETED);
            }
        },
        [setToolsWithRef]
    );

    const consumeOrderedEvent = useCallback(
        (event) => {
            const sequenceId = event?.sequenceId;
            if (!Number.isFinite(sequenceId)) {
                applyStreamEvent(event);
                return;
            }
            if (expectedSequenceRef.current === null) {
                expectedSequenceRef.current = sequenceId;
            }
            sequenceBufferRef.current.set(sequenceId, event);
            while (
                sequenceBufferRef.current.has(expectedSequenceRef.current || 0)
            ) {
                const key = expectedSequenceRef.current;
                const nextEvent = sequenceBufferRef.current.get(key);
                sequenceBufferRef.current.delete(key);
                applyStreamEvent(nextEvent);
                expectedSequenceRef.current = key + 1;
            }
        },
        [applyStreamEvent]
    );
    //初始化处理
    useEffect(() => {
        try {
            // 读取本地存储的宽度
            const raw = window.localStorage.getItem(WIDTH_STORAGE_KEY);
            // 判断宽度是否位数字
            const w = raw ? Number(raw) : NaN;
            if (
                !Number.isNaN(w) &&
                w >= MIN_PANEL_WIDTH &&
                w <= MAX_PANEL_WIDTH
            ) {
                setPanelWidth(w);
            }
        } catch (e) {}
    }, []);

    // 监听滚动事件
    useEffect(() => {
        const messagesEl = messagesRef.current;
        if (!messagesEl) return;

        messagesEl.addEventListener("scroll", handleScroll);
        return () => {
            messagesEl.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    // 面板打开时滚动到底部
    useEffect(() => {
        if (!isAiChat) return;
        scrollToBottom();
    }, [isAiChat, scrollToBottom]);

    // 当用户发送新消息时滚动到底部，并恢复自动滚动
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "user") {
            setUserScrolledUp(false);
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    // AI 回复时的智能滚动：自动滚动到底部，除非用户主动滚动上去
    useEffect(() => {
        // 只有在加载中且用户没有主动滚动上去时才自动滚动
        if (loading && !userScrolledUp) {
            scrollToBottom();
        }
    }, [streamingText, streamingTools, loading, userScrolledUp, scrollToBottom]);
    // 点击面板外部关闭面板的处理
    useEffect(() => {
        // 如果不是打开状态，直接返回
        if (!isAiChat) return;
        //常驻渲染，该函数只在isAiChat为true时添加到document上，为false时移除
        const handleClickOutSize = (e) => {
            // 如果点击的是面板内部，直接退出,不用关闭面板
            if (panelRef.current.contains(e.target)) return;
            const menuBarAi = document.getElementById("menuBarAiChat");
            console.log(
                "menuBarAi.contains(e.target)",
                menuBarAi.contains(e.target)
            );
            if (menuBarAi && menuBarAi.contains(e.target)) return;

            // 在外面就关闭面板
            onSetAiChat(false);
        };
        document.addEventListener("mousedown", handleClickOutSize);
        // 卸载时移除事件监听
        return () => {
            document.removeEventListener("mousedown", handleClickOutSize);
        };
    }, [isAiChat, onSetAiChat]);
    //面版被拖拽时，更新面板宽度
    useEffect(() => {
        if (!isAiChat) return;
        const onMove = (e) => {
            if (!draggingRef.current) return;
            const { startX, startWidth } = draggingRef.current;
            const dx = startX - e.clientX;
            //在最小宽度和当前窗口宽度之间选个目前最大的
            const viewporttLimit = Math.max(
                MIN_PANEL_WIDTH,
                window.innerWidth - 24
            );
            //在目前最大宽度和允许最大宽度之间选个最小的
            const max = Math.min(viewporttLimit, MAX_PANEL_WIDTH);
            const next = Math.min(
                max,
                Math.max(startWidth + dx, MIN_PANEL_WIDTH)
            );
            setPanelWidth(next);
        };
        const stop = () => {
            if (!draggingRef.current) return;
            draggingRef.current = null;
            try {
                window.localStorage.setItem(
                    WIDTH_STORAGE_KEY,
                    String(panelWidth)
                );
            } catch (e) {
                console.error("保存面板宽度失败", e);
            }
            document.body.classList.remove(styles.resizingBody);
        };
        document.addEventListener("mousemove", onMove); //鼠标移动时，更新面板宽度
        document.addEventListener("mouseup", stop); //鼠标释放时，保存面板宽度
        return () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", stop);
        };
    }, [isAiChat, panelWidth]);
    //开始拖拽调整面板宽度
    const startResize = useCallback(
        (e) => {
            console.log("开始拖拽调整面板宽度");
            // 阻止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
            console.log("e.clientX", e.clientX);
            //记录现在的鼠标位置和面板宽度
            draggingRef.current = {
                startX: e.clientX,
                startWidth: panelWidth,
            };
            document.body.classList.add(styles.resizingBody);
        },
        [panelWidth, isAiChat]
    );
    const handleSend = useCallback(async () => {
        const text = inputValue.trim();
        //如输入的内容为空，则直接返回
        if (!text) return;
        //将本人输入的内容添加到消息列表中，作为user角色
        setMessages((prev) => [...prev, { role: "user", content: text }]);
        //清空输入框
        setInputValue("");
        //清空回复缓冲区
        replyBufferRef.current = "";
        streamFailedRef.current = false;
        expectedSequenceRef.current = null;
        sequenceBufferRef.current.clear();
        streamingToolsRef.current = [];
        setToolsWithRef([]);
        setToolExpandedMap({});
        //清空流式文本
        setStreamingText("");
        setStreamingState(STREAM_STATES.RECEIVING);
        //设置加载状态
        setLoading(true);
        try {
            //调用流式回复接口
            await streamCoze(
                text,
                { sessionId: sessionIdRef.current },
                // 成功回调
                (event) => {
                    consumeOrderedEvent(event);
                },
                // 错误回调
                (error) => {
                    streamFailedRef.current = true;
                    setStreamingState(STREAM_STATES.FAILED);
                    const message = getCozeFriendlyError(
                        error?.code || null,
                        error?.message || null
                    );
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "assistant",
                            content: message,
                        },
                    ]);
                },
                COZE_API_TOKEN
            );
            if (
                !streamFailedRef.current &&
                (replyBufferRef.current || streamingToolsRef.current.length > 0)
            ) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: replyBufferRef.current || " ",
                        tools: streamingToolsRef.current,
                    },
                ]);
            }
        } finally {
            setStreamingText("");
            setToolsWithRef([]);
            setLoading(false);
            setStreamingState((prev) =>
                prev === STREAM_STATES.FAILED
                    ? STREAM_STATES.FAILED
                    : STREAM_STATES.IDLE
            );
        }
    }, [inputValue, consumeOrderedEvent, setToolsWithRef]);

    const toggleToolExpanded = useCallback((toolKey) => {
        setToolExpandedMap((prev) => ({
            ...prev,
            [toolKey]: !prev[toolKey],
        }));
    }, []);

    const handleKeyDown = useCallback(
        (e) => {
            console.log("e.key", e.key);
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                console.log("发送消息");
            }
        },
        [handleSend]
    );

    // 滚动到底部
    const scrollToBottom = useCallback(() => {
        if (messagesRef.current) {
            isScrollingProgrammaticallyRef.current = true;
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            setIsAtBottom(true);
            setUserScrolledUp(false);
            // 短暂延迟后重置标记
            setTimeout(() => {
                isScrollingProgrammaticallyRef.current = false;
            }, 100);
        }
    }, []);

    // 检查是否在底部
    const checkIsAtBottom = useCallback(() => {
        if (!messagesRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
        const threshold = 30; // 30px 容差
        return scrollHeight - scrollTop - clientHeight <= threshold;
    }, []);

    // 处理滚动事件
    const handleScroll = useCallback(() => {
        if (!messagesRef.current || isScrollingProgrammaticallyRef.current) return;

        const atBottom = checkIsAtBottom();
        setIsAtBottom(atBottom);

        // 只有用户手动滚动上去时才标记为 userScrolledUp
        if (!atBottom) {
            setUserScrolledUp(true);
        } else {
            // 用户滚动回底部，恢复自动滚动
            setUserScrolledUp(false);
        }
    }, [checkIsAtBottom]);

    const renderToolCard = useCallback(
        (tool, index, prefix = "tool") => {
            const toolKey = `${prefix}-${tool.toolCallId || index}`;
            const isExpanded = Boolean(toolExpandedMap[toolKey]);
            const safeParams = desensitizePayload(tool.parameters);
            const safeResult = desensitizePayload(tool.result || tool.message);
            const hasPayload = Boolean(safeParams || safeResult);
            const readableToolName = getReadableToolName(tool.toolName);
            const toolQuery = getToolQuery(safeParams);
            const statusText =
                tool.status === "pending"
                    ? "调用中"
                    : tool.status === "success"
                    ? "完成"
                    : "失败";
            return (
                <div key={toolKey} className={styles.toolCard}>
                    <div className={styles.toolHeader}>
                        <div className={styles.toolMeta}>
                            <span className={styles.toolName}>
                                {`${readableToolName} #${index + 1}`}
                            </span>
                            {toolQuery && (
                                <span className={styles.toolQuery}>
                                    {`检索词：${toolQuery}`}
                                </span>
                            )}
                        </div>
                        <div className={styles.toolHeaderRight}>
                            <span
                                className={classNames(styles.toolStatus, {
                                    [styles.toolPending]:
                                        tool.status === "pending",
                                    [styles.toolSuccess]:
                                        tool.status === "success",
                                    [styles.toolError]: tool.status === "error",
                                })}
                            >
                                {statusText}
                            </span>
                            {hasPayload && (
                                <button
                                    type="button"
                                    className={styles.toolToggleBtn}
                                    onClick={() => toggleToolExpanded(toolKey)}
                                >
                                    {isExpanded ? "收起" : "展开"}
                                </button>
                            )}
                        </div>
                    </div>
                    {isExpanded && safeParams && (
                        <pre className={styles.toolPayload}>
                            {JSON.stringify(safeParams, null, 2)}
                        </pre>
                    )}
                    {isExpanded && safeResult && (
                        <pre className={styles.toolPayload}>
                            {typeof safeResult === "string"
                                ? safeResult
                                : JSON.stringify(safeResult, null, 2)}
                        </pre>
                    )}
                </div>
            );
        },
        [toolExpandedMap, toggleToolExpanded]
    );

    const streamStateText =
        streamingState === STREAM_STATES.TOOL_RUNNING
            ? "调用工具中"
            : streamingState === STREAM_STATES.COMPLETED
            ? "回复完成"
            : streamingState === STREAM_STATES.FAILED
            ? "回复失败"
            : "正在思考";

    return (
        <div
            ref={panelRef} //通过ref绑定该div
            className={classNames(styles.panel, {
                [styles.panelOpen]: isAiChat,
            })}
            style={
                isAiChat
                    ? { width: `min(${panelWidth}px, calc(100vw - 24px))` }
                    : { width: "0px" }
            }
        >
            {/* 拖拽调整宽度的把手 */}
            <div
                className={styles.resizeHandle}
                onMouseDown={startResize}
                role="separator"
                aria-orientation="vertical"
                aria-label="调整 AI 聊天面板宽度"
            />
            {/* 面板头部 */}
            <div className={styles.header}>
                <button
                    className={styles.closeBtn}
                    onClick={() => onSetAiChat(false)}
                    title="关闭"
                >
                    <img
                        className={styles.closeBtnIcon}
                        src={CloseButton}
                        alt="关闭"
                    />
                </button>
            </div>
            {/* 消息列表 */}
            <div className={styles.messages} ref={messagesRef}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={classNames(styles.message, {
                            [styles.user]: msg.role === "user",
                            [styles.assistant]: msg.role === "assistant",
                        })}
                    >
                        <div className={styles.bubble}>
                            {msg.role === "assistant" ? (
                                <>
                                    <div className={styles.markdownContent}>
                                        {renderMarkdown(msg.content)}
                                    </div>
                                    {Array.isArray(msg.tools) &&
                                        msg.tools.length > 0 && (
                                            <div className={styles.toolList}>
                                                {msg.tools.map((tool, index) =>
                                                    renderToolCard(
                                                        tool,
                                                        index,
                                                        `history-${i}`
                                                    )
                                                )}
                                            </div>
                                        )}
                                </>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {/* 请求中：未收到流式正文前显示“正在思考”逐字动画 */}
                {loading && (
                    <>
                        {streamingText && (
                            <div
                                className={classNames(
                                    styles.message,
                                    styles.assistant
                                )}
                            >
                                <div className={styles.bubble}>
                                    <div className={styles.markdownContent}>
                                        {renderMarkdown(streamingText)}
                                    </div>
                                    {streamingTools.length > 0 && (
                                        <div className={styles.toolList}>
                                            {streamingTools.map((tool, index) =>
                                                renderToolCard(
                                                    tool,
                                                    index,
                                                    "streaming"
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div
                            className={classNames(
                                styles.message,
                                styles.assistant
                            )}
                        >
                            <div
                                className={classNames(
                                    styles.bubble,
                                    styles.stateBubble
                                )}
                            >
                                {streamStateText === "正在思考" ? (
                                    <div
                                        className={classNames(
                                            styles.streamingState,
                                            styles.thinkingText
                                        )}
                                        aria-label={streamStateText}
                                    >
                                        {streamStateText
                                            .split("")
                                            .map((char, index) => (
                                                <span
                                                    key={`${char}-${index}`}
                                                    className={
                                                        styles.thinkingChar
                                                    }
                                                    style={{
                                                        animationDelay: `${
                                                            index * 0.24
                                                        }s`,
                                                    }}
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                    </div>
                                ) : (
                                    <div className={styles.streamingState}>
                                        {streamStateText}
                                    </div>
                                )}
                                {!streamingText && streamingTools.length > 0 && (
                                    <div className={styles.toolList}>
                                        {streamingTools.map((tool, index) =>
                                            renderToolCard(
                                                tool,
                                                index,
                                                "streaming"
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* 滚动到底部悬浮按钮 - 当用户滚动上去看历史消息时显示 */}
            {userScrolledUp && loading && (
                <button
                    className={classNames(
                        styles.scrollToBottomBtn,
                        streamingState === STREAM_STATES.RECEIVING &&
                            styles.scrollToBottomBtnAnimating
                    )}
                    onClick={scrollToBottom}
                    aria-label="滚动到底部"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7 10L12 15L17 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}

            {/* 输入区域 */}
            <div className={styles.inputRow}>
                <textarea
                    className={styles.input}
                    value={inputValue}
                    placeholder="输入消息，Enter 发送，Shift+Enter 换行"
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    rows={2}
                />
                <button
                    className={classNames(styles.sendBtn, {
                        [styles.sendBtnDisabled]: !inputValue.trim() || loading,
                    })}
                    onClick={handleSend}
                    disabled={!inputValue.trim() || loading}
                >
                    发送
                </button>
            </div>
        </div>
    );
};

export default AiChat;
