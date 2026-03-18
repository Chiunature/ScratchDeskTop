import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './ai-chat.css';

const AiChat = ({ isAiChat, onSetAiChat }) => {
    const panelRef = useRef(null);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '你好！我是 AI 助手，有什么可以帮你的吗？' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!isAiChat) return;
        function handleClickOutside(e) {
            if (!panelRef.current) return;
            if (panelRef.current.contains(e.target)) return;
            const menuBarAi = document.getElementById('menuBarAiChat');
            if (menuBarAi && menuBarAi.contains(e.target)) return;
            onSetAiChat(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAiChat, onSetAiChat]);

    function handleSend() {
        const text = inputValue.trim();
        if (!text || loading) return;
        const newMessages = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setInputValue('');
        setLoading(true);

        // 调用 Electron 主进程或直接 HTTP 请求 AI 接口
        // 这里用一个占位回复，你可以替换为真实 API 调用
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `（AI 回复占位）你说的是：「${text}」` }
            ]);
            setLoading(false);
        }, 800);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div
            ref={panelRef}
            className={classNames(styles.panel, { [styles.panelOpen]: isAiChat })}
        >
            <div className={styles.header}>
                <span className={styles.title}>AI 助手</span>
                <button
                    className={styles.closeBtn}
                    onClick={() => onSetAiChat(false)}
                    title="关闭"
                >
                    ✕
                </button>
            </div>
            <div className={styles.messages}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={classNames(styles.message, {
                            [styles.user]: msg.role === 'user',
                            [styles.assistant]: msg.role === 'assistant',
                        })}
                    >
                        <div className={styles.bubble}>{msg.content}</div>
                    </div>
                ))}
                {loading && (
                    <div className={classNames(styles.message, styles.assistant)}>
                        <div className={classNames(styles.bubble, styles.typing)}>
                            <span /><span /><span />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputRow}>
                <textarea
                    className={styles.input}
                    value={inputValue}
                    placeholder="输入消息，Enter 发送，Shift+Enter 换行"
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                />
                <button
                    className={classNames(styles.sendBtn, { [styles.sendBtnDisabled]: !inputValue.trim() || loading })}
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
