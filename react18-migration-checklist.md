# React 18 升级评估与迁移清单

本文件为当前代码库（`scratch-gui`）升级到 React 18 的具体评估与迁移清单，包含依赖升级建议与逐文件迁移点。

## 依赖升级清单（具体）

### 必须升级（核心）

-   `react` → 18.x
-   `react-dom` → 18.x
-   `react-test-renderer` → 18.x
-   `peerDependencies.react` / `peerDependencies.react-dom` → 18.x

### 必须替换（测试栈）

-   `enzyme` → 替换为 `@testing-library/react`
-   `enzyme-adapter-react-16` → 移除
-   补充：`@testing-library/jest-dom`、`@testing-library/user-event`

### 高风险依赖（强烈建议升级或替代）

-   `react-intl@2.9.0` → 建议升级至 5/6 代
-   `react-virtualized@9.20.1` → 建议替代为 `react-window` 或 `react-virtuoso`
-   `react-modal@3.9.1` → 升级到支持 React 18 的新版本
-   `react-contextmenu@2.9.4` → 建议替代（如 `@radix-ui/react-dropdown-menu`）
-   `react-monaco-editor@0.28.0` → 升级至支持 React 18 的版本
-   `react-redux@7.1.1` → 建议升级至 8.x
-   `redux@3.7.2` → 建议升级至 4.x

### 可能需要同步升级（视报错而定）

-   `react-tabs`、`react-tooltip`、`react-color` 等

## 逐文件迁移清单（具体）

### A) 渲染入口（必须改）

以下文件存在 `ReactDOM.render`，需要迁移到 `createRoot`：

-   `scratch-gui/src/playground/render-gui.jsx`
-   `scratch-gui/src/playground/player.jsx`
-   `scratch-gui/src/playground/index.jsx`
-   `scratch-gui/src/playground/compatibility-testing.jsx`
-   `scratch-gui/src/playground/blocks-only.jsx`

### B) 生命周期替换（必须改）

以下文件使用 `componentWillReceiveProps`，建议迁移为 `componentDidUpdate` 或 hooks：

-   `scratch-gui/src/containers/sound-tab.jsx`
-   `scratch-gui/src/lib/sortable-hoc.jsx`

### C) 测试基础设施（必须改）

-   `scratch-gui/test/helpers/enzyme-setup.js`  
    目前为 Enzyme 配置，需移除并改为 RTL setup。

-   `scratch-gui/test/helpers/intl-helpers.jsx`  
    使用 `childContextTypes` 和 Enzyme，需迁移为 RTL + `IntlProvider` 包装。

### D) 单测文件（需要逐个迁移）

当前使用 Enzyme 的测试文件（需改为 RTL）：

-   `scratch-gui/test/unit/util/vm-manager-hoc.test.jsx`
-   `scratch-gui/test/unit/util/vm-listener-hoc.test.jsx`
-   `scratch-gui/test/unit/util/throttled-property-hoc.test.jsx`
-   `scratch-gui/test/unit/util/project-saver-hoc.test.jsx`
-   `scratch-gui/test/unit/util/hash-project-loader-hoc.test.jsx`
-   `scratch-gui/test/unit/util/cloud-manager-hoc.test.jsx`
-   `scratch-gui/test/unit/containers/slider-prompt.test.jsx`
-   `scratch-gui/test/unit/containers/menu-bar-hoc.test.jsx`
-   `scratch-gui/test/unit/components/icon-button.test.jsx`
-   `scratch-gui/test/unit/components/button.test.jsx`

## 迁移步骤建议（顺序）

1. 升级 `react` / `react-dom` / `react-test-renderer`
2. 改入口渲染 API（`ReactDOM.render` → `createRoot`）
3. 替换过时生命周期（`componentWillReceiveProps`）
4. 测试栈迁移（Enzyme → RTL）
5. 升级/替代高风险依赖
6. 运行单测与手动回归验证
