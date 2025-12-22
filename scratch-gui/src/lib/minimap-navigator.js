/**
 * 迷你地图导航器
 * 用于显示工作区缩略图并支持双向导航
 * 小窗口模式，无遮罩层
 * 使用 save-svg-as-png 库生成缩略图
 */

import { svgAsDataUri } from "save-svg-as-png";

class MinimapNavigator {
    constructor(mainWorkspace, container, options = {}) {
        this.workspace = mainWorkspace;
        this.container = container;
        this.isVisible = false; // 默认隐藏，通过按钮控制
        this.isDragging = false;
        this.isDraggingWindow = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.windowX = options.x || 20;
        this.windowY = options.y || 80;
        this.scrollListener = null;
        this.updateInterval = null;
        this.changeListener = null; // 监听工作区变化
        this.isDraggingViewport = false; // 是否正在拖拽视口框

        // 缩略图窗口尺寸
        this.windowWidth = options.width || 200;
        this.windowHeight = options.height || 150;

        // 将 minimapNavigator 保存到 workspace，方便按钮访问
        this.workspace.minimapNavigator = this;

        this.createMinimap();
    }

    createMinimap() {
        // 创建独立窗口容器（可拖拽）
        this.minimapContainer = document.createElement("div");
        this.minimapContainer.style.cssText = `
            position: fixed;
            top: ${this.windowY}px;
            left: ${this.windowX}px;
            width: ${this.windowWidth}px;
            height: ${this.windowHeight}px;
            background: white;
            border: 2px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            overflow: hidden;
            z-index: 9999;
            display: none;
            flex-direction: column;
            user-select: none;
        `;

        // 创建标题栏（可拖拽）
        const header = document.createElement("div");
        header.style.cssText = `
            height: 24px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 8px;
            cursor: move;
            font-size: 12px;
            color: #666;
            flex-shrink: 0;
        `;

        const title = document.createElement("span");
        title.textContent = "缩略图";
        title.style.cssText = `font-weight: 500;`;

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.cssText = `
            width: 18px;
            height: 18px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            padding: 0;
            color: #666;
        `;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            this.hide();
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 创建缩略图内容区域
        this.contentArea = document.createElement("div");
        this.contentArea.style.cssText = `
            flex: 1;
            position: relative;
            overflow: hidden;
            background: #fafafa;
        `;

        // 创建缩略图 Canvas 容器（使用 Canvas 显示图片）
        this.minimapCanvas = document.createElement("canvas");
        this.minimapCanvas.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            cursor: pointer;
        `;

        // 创建加载提示
        this.loadingText = document.createElement("div");
        this.loadingText.textContent = "加载中...";
        this.loadingText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #999;
            font-size: 12px;
            pointer-events: none;
        `;

        // 创建视口指示器（可拖拽）
        this.viewportBox = document.createElement("div");
        this.viewportBox.style.cssText = `
            position: absolute;
            border: 2px solid #4C97FF;
            background: rgba(76, 151, 255, 0.15);
            cursor: move;
            z-index: 1001;
            box-sizing: border-box;
            user-select: none;
            pointer-events: auto;
        `;

        this.contentArea.appendChild(this.minimapCanvas);
        this.contentArea.appendChild(this.loadingText);
        this.contentArea.appendChild(this.viewportBox);

        this.minimapContainer.appendChild(header);
        this.minimapContainer.appendChild(this.contentArea);
        document.body.appendChild(this.minimapContainer);

        // 绑定事件
        this.setupEvents(header);

        // 默认隐藏
        this.hide();
    }
    setupEvents(header) {
        // 窗口拖拽 - 标题栏
        header.addEventListener("mousedown", (e) => {
            if (e.target.tagName === "BUTTON") return;
            this.isDraggingWindow = true;
            this.dragStartX = e.clientX - this.windowX;
            this.dragStartY = e.clientY - this.windowY;
            e.preventDefault();
        });

        // 鼠标移动 - 窗口拖拽、视口移动或视口框拖拽
        document.addEventListener("mousemove", (e) => {
            if (this.isDraggingWindow && this.isVisible) {
                // 拖拽窗口
                this.windowX = e.clientX - this.dragStartX;
                this.windowY = e.clientY - this.dragStartY;
                this.minimapContainer.style.left = this.windowX + "px";
                this.minimapContainer.style.top = this.windowY + "px";
            } else if (this.isDraggingViewport && this.isVisible) {
                // 拖拽视口框
                this.handleViewportDrag(e);
            } else if (this.isDragging && this.isVisible) {
                // 拖拽视口（点击缩略图）
                this.handleMove(e);
            }
        });

        // 鼠标释放
        document.addEventListener("mouseup", () => {
            this.isDragging = false;
            this.isDraggingWindow = false;
            this.isDraggingViewport = false;
        });

        // 点击缩略图跳转（Canvas 和内容区域）
        this.minimapCanvas.addEventListener("mousedown", (e) => {
            this.isDragging = true;
            this.handleMove(e);
            e.preventDefault();
            e.stopPropagation();
        });

        // 视口框拖拽
        this.viewportBox.addEventListener("mousedown", (e) => {
            console.log("[调试] 视口框 mousedown 触发");
            this.isDraggingViewport = true;
            this.isDragging = false; // 防止触发点击事件
            e.stopPropagation();
            e.preventDefault();
        });

        this.contentArea.addEventListener("mousedown", (e) => {
            if (
                e.target === this.viewportBox ||
                e.target === this.loadingText ||
                e.target.tagName === "BUTTON"
            ) {
                return;
            }
            this.isDragging = true;
            this.handleMove(e);
            e.preventDefault();
        });

        // 点击缩略图跳转
        this.minimapCanvas.addEventListener("click", (e) => {
            if (!this.isDragging && !this.isDraggingViewport) {
                this.handleClick(e);
            }
        });

        this.contentArea.addEventListener("click", (e) => {
            if (
                !this.isDragging &&
                !this.isDraggingViewport &&
                e.target !== this.viewportBox &&
                e.target !== this.loadingText &&
                e.target.tagName !== "BUTTON"
            ) {
                this.handleClick(e);
            }
        });
    }

    clampView(viewLeft, viewTop, metrics) {
        const minX = metrics.contentLeft;
        const maxX =
            metrics.contentLeft + metrics.contentWidth - metrics.viewWidth;
        const minY = metrics.contentTop;
        const maxY =
            metrics.contentTop + metrics.contentHeight - metrics.viewHeight;
        return {
            x: Math.min(Math.max(viewLeft, minX), maxX),
            y: Math.min(Math.max(viewTop, minY), maxY),
        };
    }

    scrollToView(viewLeft, viewTop) {
        const metrics = this.workspace.getMetrics();
        if (
            !metrics ||
            metrics.contentWidth === 0 ||
            metrics.contentHeight === 0
        ) {
            return;
        }
        const clamped = this.clampView(viewLeft, viewTop, metrics);
        const scrollX = clamped.x - metrics.contentLeft;
        const scrollY = clamped.y - metrics.contentTop;
        if (this.workspace.scrollbar && this.workspace.scrollbar.set) {
            this.workspace.scrollbar.set(scrollX, scrollY);
        } else {
            this.workspace.startDragMetrics = metrics;
            this.workspace.scroll(clamped.x, clamped.y);
        }
        this.updateViewport();
    }

    handleMove(e) {
        const rect = this.contentArea.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const metrics = this.workspace.getMetrics();
        if (
            !metrics ||
            metrics.contentWidth === 0 ||
            metrics.contentHeight === 0
        )
            return;

        const ratioX = clickX / rect.width;
        const ratioY = clickY / rect.height;
        const contentX = metrics.contentLeft + ratioX * metrics.contentWidth;
        const contentY = metrics.contentTop + ratioY * metrics.contentHeight;

        const viewLeft = contentX - metrics.viewWidth / 2;
        const viewTop = contentY - metrics.viewHeight / 2;

        this.scrollToView(viewLeft, viewTop);
    }

    handleClick(e) {
        const rect = this.contentArea.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const metrics = this.workspace.getMetrics();
        if (
            !metrics ||
            metrics.contentWidth === 0 ||
            metrics.contentHeight === 0
        ) {
            return;
        }

        const ratioX = clickX / rect.width;
        const ratioY = clickY / rect.height;
        const contentX = metrics.contentLeft + ratioX * metrics.contentWidth;
        const contentY = metrics.contentTop + ratioY * metrics.contentHeight;

        const viewLeft = contentX - metrics.viewWidth / 2;
        const viewTop = contentY - metrics.viewHeight / 2;

        this.scrollToView(viewLeft, viewTop);
    }

    handleViewportDrag(e) {
        const rect = this.contentArea.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const metrics = this.workspace.getMetrics();
        if (
            !metrics ||
            metrics.contentWidth === 0 ||
            metrics.contentHeight === 0
        )
            return;

        const ratioX = mouseX / rect.width;
        const ratioY = mouseY / rect.height;
        const contentX = metrics.contentLeft + ratioX * metrics.contentWidth;
        const contentY = metrics.contentTop + ratioY * metrics.contentHeight;

        const viewLeft = contentX - metrics.viewWidth / 2;
        const viewTop = contentY - metrics.viewHeight / 2;

        this.scrollToView(viewLeft, viewTop);
    }

    updateViewport() {
        if (!this.isVisible) return;

        const metrics = this.workspace.getMetrics();
        const rect = this.contentArea.getBoundingClientRect();

        if (metrics.contentWidth === 0 || metrics.contentHeight === 0) {
            return;
        }

        // 计算视口在内容中的相对位置（0-1 之间的比例）
        const ratioX =
            (metrics.viewLeft - metrics.contentLeft) / metrics.contentWidth;
        const ratioY =
            (metrics.viewTop - metrics.contentTop) / metrics.contentHeight;
        const ratioWidth = metrics.viewWidth / metrics.contentWidth;
        const ratioHeight = metrics.viewHeight / metrics.contentHeight;

        const viewportX = ratioX * rect.width;
        const viewportY = ratioY * rect.height;
        const viewportWidth = ratioWidth * rect.width;
        const viewportHeight = ratioHeight * rect.height;

        this.viewportBox.style.left = Math.max(0, viewportX) + "px";
        this.viewportBox.style.top = Math.max(0, viewportY) + "px";
        this.viewportBox.style.width =
            Math.min(viewportWidth, rect.width - viewportX) + "px";
        this.viewportBox.style.height =
            Math.min(viewportHeight, rect.height - viewportY) + "px";
    }

    async refreshMinimap() {
        if (!this.isVisible) return;

        // 等待一下确保 DOM 已渲染
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 获取工作区的块画布（只包含块，不包含其他UI元素）
        // 尝试多个选择器，确保能找到
        let blockCanvas = null;

        // 方法1: 通过 workspace 直接获取（最可靠）
        if (this.workspace.svgBlockCanvas_) {
            blockCanvas = this.workspace.svgBlockCanvas_;
        }

        // 方法2: 通过 DOM 查询
        if (!blockCanvas) {
            blockCanvas = document.querySelector(
                ".blocklyWorkspace .blocklyBlockCanvas"
            );
        }

        // 方法3: 通过 getParentSvg 查找
        if (!blockCanvas) {
            const workspaceSvg = this.workspace.getParentSvg();
            if (workspaceSvg) {
                blockCanvas = workspaceSvg.querySelector(".blocklyBlockCanvas");
            }
        }

        if (!blockCanvas) {
            console.warn("无法找到块画布，尝试延迟重试");
            setTimeout(() => this.refreshMinimap(), 500);
            return;
        }

        // 检查是否有块内容
        const hasBlocks =
            blockCanvas.children && blockCanvas.children.length > 0;
        if (!hasBlocks) {
            console.warn("块画布为空，没有积木块");
            this.loadingText.textContent = "暂无积木块";
            this.loadingText.style.display = "block";
            return;
        }

        try {
            this.loadingText.textContent = "生成中...";
            this.loadingText.style.display = "block";

            const metrics = this.workspace.getMetrics();
            const rect = this.contentArea.getBoundingClientRect();

            if (
                !metrics ||
                metrics.contentWidth === 0 ||
                metrics.contentHeight === 0
            ) {
                this.loadingText.textContent = "工作区为空";
                return;
            }

            // 获取块的边界框
            let bbox;
            try {
                bbox = blockCanvas.getBBox();
                // 检查边界框是否有效
                if (
                    !bbox ||
                    isNaN(bbox.width) ||
                    isNaN(bbox.height) ||
                    bbox.width <= 0 ||
                    bbox.height <= 0
                ) {
                    throw new Error("无效的边界框");
                }
            } catch (e) {
                // 如果没有块或边界框无效，使用工作区尺寸
                bbox = {
                    x: metrics.contentLeft || 0,
                    y: metrics.contentTop || 0,
                    width: Math.max(metrics.contentWidth, 400),
                    height: Math.max(metrics.contentHeight, 300),
                };
            }

            const transform = blockCanvas.getAttribute("transform");
            let currentScale = 1;
            if (transform) {
                const scaleMatch = transform.match(/scale\(([^)]+)\)/);
                if (scaleMatch) {
                    const scaleValue = scaleMatch[1].split(",")[0].trim();
                    currentScale = parseFloat(scaleValue) || 1;
                }
            }

            // 计算缩放比例（缩略图尺寸 / 实际内容尺寸）
            const targetWidth = rect.width;
            const targetHeight = rect.height;
            const contentWidth = bbox.width * currentScale;
            const contentHeight = bbox.height * currentScale;

            if (contentWidth === 0 || contentHeight === 0) {
                this.loadingText.textContent = "内容尺寸无效";
                return;
            }

            const scaleX = targetWidth / contentWidth;
            const scaleY = targetHeight / contentHeight;
            const finalScale = Math.min(scaleX, scaleY) * 0.85; // 留边距

            // 使用 svgAsDataUri 将 SVG 转换为图片
            const dataUri = await svgAsDataUri(blockCanvas, {
                backgroundColor: "#fafafa",
                left: bbox.x * currentScale,
                top: bbox.y * currentScale,
                width: contentWidth,
                height: contentHeight,
                scale: finalScale,
            });

            // 将图片绘制到 Canvas
            const img = new Image();
            img.onload = () => {
                const ctx = this.minimapCanvas.getContext("2d");
                this.minimapCanvas.width = targetWidth;
                this.minimapCanvas.height = targetHeight;

                // 清空画布并填充背景
                ctx.fillStyle = "#fafafa";
                ctx.fillRect(
                    0,
                    0,
                    this.minimapCanvas.width,
                    this.minimapCanvas.height
                );

                // 计算居中位置
                const imgWidth = img.width;
                const imgHeight = img.height;
                const x = Math.max(0, (targetWidth - imgWidth) / 2);
                const y = Math.max(0, (targetHeight - imgHeight) / 2);

                // 绘制图片
                ctx.drawImage(img, x, y, imgWidth, imgHeight);

                // 保存缩放和偏移信息，用于点击坐标转换
                this.minimapOffsetX = x;
                this.minimapOffsetY = y;
                this.minimapScale = finalScale;
                this.minimapBbox = bbox;
                this.minimapCurrentScale = currentScale;

                this.loadingText.style.display = "none";
                this.updateViewport();
            };
            img.onerror = (error) => {
                this.loadingText.textContent = "生成失败";
                this.loadingText.style.display = "block";
                console.error("缩略图生成失败:", error);
            };
            img.src = dataUri;
        } catch (error) {
            console.error("刷新缩略图失败:", error);
            this.loadingText.textContent = "生成失败: " + error.message;
            this.loadingText.style.display = "block";
        }
    }

    show() {
        this.isVisible = true;
        if (this.minimapContainer) {
            this.minimapContainer.style.display = "flex";
        }

        // 延迟刷新缩略图，确保工作区已完全渲染
        setTimeout(() => {
            this.refreshMinimap();
        }, 200);

        // 监听主工作区滚动，同步更新视口指示器
        this.scrollListener = () => {
            requestAnimationFrame(() => {
                this.updateViewport();
            });
        };

        // 监听工作区变化（块添加/删除/移动），自动刷新缩略图
        this.changeListener = (event) => {
            // 检查是否是块相关的变化
            const isBlockChange =
                event.type === "create" ||
                event.type === "delete" ||
                event.type === "move" ||
                event.type === "change";

            if (isBlockChange) {
                // 防抖：延迟刷新，避免频繁更新
                if (this.refreshTimeout) {
                    clearTimeout(this.refreshTimeout);
                }
                this.refreshTimeout = setTimeout(() => {
                    this.refreshMinimap();
                }, 500);
            }
            // 其他变化只更新视口
            requestAnimationFrame(() => {
                this.updateViewport();
            });
        };

        // 使用 Blockly 的 change 事件来监听滚动和变化
        if (this.workspace.addChangeListener) {
            this.workspace.addChangeListener(this.scrollListener);
            this.workspace.addChangeListener(this.changeListener);
        }

        // 也监听窗口滚动和resize
        window.addEventListener("scroll", this.scrollListener, true);
        window.addEventListener("resize", this.scrollListener);

        // 定期更新（作为备用方案）
        this.updateInterval = setInterval(() => {
            this.updateViewport();
        }, 1000);

        this.updateViewport();
    }

    hide() {
        this.isVisible = false;
        if (this.minimapContainer) {
            this.minimapContainer.style.display = "none";
        }

        if (this.scrollListener) {
            if (this.workspace.removeChangeListener) {
                this.workspace.removeChangeListener(this.scrollListener);
            }
            window.removeEventListener("scroll", this.scrollListener, true);
            window.removeEventListener("resize", this.scrollListener);
        }

        if (this.changeListener) {
            if (this.workspace.removeChangeListener) {
                this.workspace.removeChangeListener(this.changeListener);
            }
        }

        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null;
        }

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    destroy() {
        this.hide();
        if (this.minimapContainer && this.minimapContainer.parentNode) {
            this.minimapContainer.parentNode.removeChild(this.minimapContainer);
        }
    }
}
export default MinimapNavigator;
