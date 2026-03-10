import { configureStore } from "@reduxjs/toolkit";
import throttle from "redux-throttle";
import localesReducer, {
    initLocale,
    localesInitialState,
} from "../reducers/locales";
import { detectLocale } from "./detect-locale";
import locales from "scratch-l10n";

const throttleMiddleware = throttle(300, { leading: true, trailing: true });

/**
 * 工厂函数：根据 localesOnly 标志和初始 props 创建 Redux store。
 * - localesOnly=true：仅包含 locales reducer（用于不支持浏览器的 modal 场景）
 * - localesOnly=false：包含完整 scratchGui reducer + locales
 */
export function createAppStore(localesOnly, props = {}) {
    let initializedLocales = localesInitialState;
    const locale = detectLocale(Object.keys(locales));
    if (locale !== "en") {
        initializedLocales = initLocale(initializedLocales, locale);
    }

    if (localesOnly) {
        return configureStore({
            reducer: { locales: localesReducer },
            preloadedState: { locales: initializedLocales },
            devTools: process.env.NODE_ENV !== "production",
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                    immutableCheck: false,
                }),
        });
    }

    // 延迟 require，与原 app-state-hoc 保持一致，避免在不支持的浏览器中载入多余代码
    const guiRedux = require("../reducers/gui");
    const {
        default: guiReducer,
        guiInitialState,
        initFullScreen,
        initPlayer,
        initTelemetryModal,
    } = guiRedux;

    let preloadedGui = guiInitialState;
    if (props.isFullScreen) {
        preloadedGui = initFullScreen(preloadedGui);
    }
    if (props.isPlayerOnly) {
        preloadedGui = initPlayer(preloadedGui);
    }
    if (props.showTelemetryModal) {
        preloadedGui = initTelemetryModal(preloadedGui);
    }

    return configureStore({
        reducer: {
            locales: localesReducer,
            scratchGui: guiReducer,
        },
        preloadedState: {
            locales: initializedLocales,
            scratchGui: preloadedGui,
        },
        // state 中包含 vm、workspace 等含循环引用的非普通对象，
        // 必须同时关闭 serializableCheck 和 immutableCheck，
        // 否则 RTK 的 trackProperties 会无限递归导致栈溢出
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false,
            }).concat(throttleMiddleware),
        devTools: process.env.NODE_ENV !== "production",
    });
}
