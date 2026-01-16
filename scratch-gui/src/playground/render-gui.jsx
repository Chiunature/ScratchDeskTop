import React from "react";
import ReactDOM from "react-dom";
import { compose } from "redux";
import "regenerator-runtime/runtime";
import AppStateHOC from "../lib/app-state-hoc.jsx";
import GUI from "../containers/gui.jsx";
import HashParserHOC from "../lib/hash-parser-hoc.jsx";
import log from "../lib/log.js";
import { ipc as ipc_Render } from "est-link";

const onClickLogo = () => {
    window.location = "#";
    // window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.LOGO.OPEN, 'http://www.drluck.cn/');
};

const handleTelemetryModalCancel = () => {
    log("User canceled telemetry modal");
};

const handleTelemetryModalOptIn = () => {
    log("User opted into telemetry");
};

const handleTelemetryModalOptOut = () => {
    log("User opted out of telemetry");
};
const getThemeStorage = () => {
    let theme = window.myAPI.getStoreValue("themeColor");
    return theme ? theme : "#883ec9";
};
const getModalStorage = () => {
    let modal = window.myAPI.getStoreValue("modalColor");
    return modal ? modal : "hsla(0, 0%, 24%, 0.7)";
};

async function getStaticPath() {
    let oldPath = localStorage.getItem("static_path");
    const newPath = await window.myAPI.ipcInvoke(
        ipc_Render.SEND_OR_ON.SET_STATIC_PATH
    );
    if (!oldPath || (oldPath?.length > 0 && oldPath !== newPath)) {
        localStorage.setItem("static_path", newPath);
    }
    return oldPath;
}

requestIdleCallback(() => {
    getStaticPath().then((path) => {
        window.resourcesPath = path;
    });
    document.body.style.setProperty("--motion-primary", getThemeStorage());
    document.body.style.setProperty("--modal-overlay", getModalStorage());
});
/*
 * Render the GUI playground. This is a separate function because importing anything
 * that instantiates the VM causes unsupported browsers to crash
 * {object} appTarget - the DOM element to render to
 */
export default (appTarget) => {
    GUI.setAppElement(appTarget);

    // note that redux's 'compose' function is just being used as a general utility to make
    // the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
    // ability to compose reducers.
    const WrappedGui = compose(AppStateHOC, HashParserHOC)(GUI);

    // TODO a hack for testing the backpack, allow backpack host to be set by url param
    const backpackHostMatches = window.location.href.match(
        /[?&]backpack_host=([^&]*)&?/
    );
    const backpackHost = backpackHostMatches ? backpackHostMatches[1] : null;

    const scratchDesktopMatches = window.location.href.match(
        /[?&]isScratchDesktop=([^&]+)/
    );
    let simulateScratchDesktop;
    if (scratchDesktopMatches) {
        try {
            // parse 'true' into `true`, 'false' into `false`, etc.
            simulateScratchDesktop = JSON.parse(scratchDesktopMatches[1]);
        } catch {
            // it's not JSON so just use the string
            // note that a typo like "falsy" will be treated as true
            simulateScratchDesktop = scratchDesktopMatches[1];
        }
    }

    if (process.env.NODE_ENV === "production" && typeof window === "object") {
        // Warn before navigating away
        window.onbeforeunload = () => true;
    }

    ReactDOM.render(
        // important: this is checking whether `simulateScratchDesktop` is truthy, not just defined!
        simulateScratchDesktop ? (
            <WrappedGui
                canEditTitle
                isScratchDesktop
                showTelemetryModal
                canSave={false}
                onTelemetryModalCancel={handleTelemetryModalCancel}
                onTelemetryModalOptIn={handleTelemetryModalOptIn}
                onTelemetryModalOptOut={handleTelemetryModalOptOut}
            />
        ) : (
            <WrappedGui
                canEditTitle
                backpackVisible
                showComingSoon
                backpackHost={backpackHost}
                canSave={false}
                onClickLogo={onClickLogo}
            />
        ),
        appTarget
    );
};
