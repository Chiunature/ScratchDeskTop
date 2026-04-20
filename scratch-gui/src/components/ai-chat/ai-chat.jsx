import React, { useRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ai-chat.css";
import { streamCoze, extractCozeText } from "../../utils/coze-stream";
import { COZE_API_TOKEN } from "../../config/coze.config";
import CloseButton from "../../../static/IconAI/icon-close.svg";
const WIDTH_STORAGE_KEY = "aiChatPanelWidth";
const DEFAULT_PANEL_WIDTH = 480;
const MIN_PANEL_WIDTH = 360;
const MAX_PANEL_WIDTH = 720;

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

function getExtFromLanguage(language) {
    const lang = (language || "").toLowerCase();
    return LANGUAGE_TO_EXT[lang] || "py";
}

const generateSessionId = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
};

/**
 * AI聊天面板组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isAiChat - 控制面板是否显示
 * @param {Function} props.onSetAiChat - 设置面板显示状态的函数
 */
const AiChat = ({ isAiChat, onSetAiChat, onRunAiCode, peripheralName }) => {
    const panelRef = useRef(null);
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
    const replyBufferRef = useRef(""); //回复缓冲区，用于存储流式回复的文本
    const sessionIdRef = useRef(generateSessionId());

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
        //清空流式文本
        setStreamingText("");
        //设置加载状态
        setLoading(true);
        //流式回复默认失败
        let streamFailed = false;
        try {
            //调用流式回复接口
            await streamCoze(
                text,
                { sessionId: sessionIdRef.current },
                // 成功回调
                (data) => {
                    //提取文字内容
                    const chunk = extractCozeText(data);
                    if (!chunk) return;
                    console.log("chunk", chunk);
                    replyBufferRef.current += chunk;
                    setStreamingText(replyBufferRef.current);
                },
                // 错误回调
                (error) => {
                    streamFailed = true;
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "assistant",
                            content: error?.message || "请求失败，请稍后重试",
                        },
                    ]);
                },
                COZE_API_TOKEN
            );
            if (!streamFailed && replyBufferRef.current) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: replyBufferRef.current,
                    },
                ]);
            }
        } finally {
            setStreamingText("");
            setLoading(false);
        }
    }, [inputValue]);

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
            <div className={styles.messages}>
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
                                <div className={styles.markdownContent}>
                                    {renderMarkdown(msg.content)}
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {/* 请求中：先显示 CSS 三点；收到第一个字后显示流式正文 */}
                {loading && (
                    <div
                        className={classNames(styles.message, styles.assistant)}
                    >
                        {streamingText ? (
                            <div className={styles.bubble}>
                                <div className={styles.markdownContent}>
                                    {renderMarkdown(streamingText)}
                                </div>
                            </div>
                        ) : (
                            <div
                                className={classNames(
                                    styles.bubble,
                                    styles.typing
                                )}
                                aria-label="正在生成回复"
                            >
                                <span />
                                <span />
                                <span />
                            </div>
                        )}
                    </div>
                )}
                {/* <div ref={messagesEndRef} /> */}
            </div>
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
