import React from "react";
import styles from "./device.css";

const VERSION_KEYS = new Set(["version", "Softwareversion", "SoftwareVersion"]);

const parseSegments = (val) => {
    if (val == null || val === "") return [];
    if (Array.isArray(val)) {
        return val.map((s) => String(s).trim()).filter(Boolean);
    }
    return String(val)
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
};

const formatSegmentDisplay = (segment) => {
    const t = String(segment).replace(/\s+/g, "");
    const idx = t.indexOf(":");
    if (idx === -1) return t;
    return `${t.slice(0, idx)}: ${t.slice(idx + 1)}`;
};

const hasPipeContent = (val) => {
    if (val == null) return false;
    if (Array.isArray(val)) return val.length > 0;
    return String(val).trim() !== "";
};

const collectRawAndBinary = (gray) => {
    const rawCells = [];
    const binaryTags = [];

    if (hasPipeContent(gray.n)) {
        rawCells.push(...parseSegments(gray.n));
    } else {
        for (const key of Object.keys(gray)) {
            if (key === "Not_Run" || VERSION_KEYS.has(key)) continue;
            if (/^\d+$/.test(key)) {
                rawCells.push(`${key}:${gray[key]}`);
            }
        }
        rawCells.sort((a, b) => {
            const na = parseInt(String(a).split(":")[0], 10);
            const nb = parseInt(String(b).split(":")[0], 10);
            if (Number.isNaN(na) || Number.isNaN(nb)) return 0;
            return na - nb;
        });
    }

    if (hasPipeContent(gray.b)) {
        binaryTags.push(...parseSegments(gray.b));
    } else {
        for (const key of Object.keys(gray)) {
            if (key === "Not_Run" || VERSION_KEYS.has(key)) continue;
            if (/^b\d+$/i.test(key)) {
                binaryTags.push(`${key}:${gray[key]}`);
            }
        }
        binaryTags.sort((a, b) => {
            const ma = String(a).match(/^b(\d+)/i);
            const mb = String(b).match(/^b(\d+)/i);
            if (ma && mb) {
                return parseInt(ma[1], 10) - parseInt(mb[1], 10);
            }
            return 0;
        });
    }

    return { rawCells, binaryTags };
};

const getVersionText = (gray) => {
    for (const k of ["SoftwareVersion", "Softwareversion", "version"]) {
        if (gray[k] != null && String(gray[k]).trim() !== "") {
            let v = String(gray[k]).trim();
            if (/^v\d/i.test(v) === false && /^\d/.test(v)) {
                v = `V${v}`;
            }
            return v;
        }
    }
    return null;
};

const DeviceBoxGray = ({ gray, intl, messages }) => {
    if (!gray || Object.keys(gray).length === 0) return null;

    if (gray.Not_Run) {
        return (
            <div className={styles.grayCard}>
                <div className={styles.grayError}>Error</div>
            </div>
        );
    }

    const { rawCells, binaryTags } = collectRawAndBinary(gray);
    const versionText = getVersionText(gray);
    const hasBody =
        rawCells.length > 0 || binaryTags.length > 0 || versionText != null;
    if (!hasBody) return null;

    return (
        <div className={styles.grayCard}>
            {rawCells.length > 0 && (
                <section className={styles.graySection}>
                    <div className={styles.graySectionLabel}>
                        {intl.formatMessage(messages.grayRawParams)}
                    </div>
                    <div className={styles.grayRawGrid}>
                        {rawCells.map((text, i) => (
                            <div key={`n-${i}`} className={styles.grayRawCell}>
                                {formatSegmentDisplay(text)}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {binaryTags.length > 0 && (
                <section className={styles.graySection}>
                    <div className={styles.graySectionLabel}>
                        {intl.formatMessage(messages.grayBinaryStatus)}
                    </div>
                    <div className={styles.grayBinaryRow}>
                        {binaryTags.map((text, i) => (
                            <span
                                key={`b-${i}`}
                                className={styles.grayBinaryTag}
                            >
                                {formatSegmentDisplay(text)}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {versionText != null && (
                <>
                    <div className={styles.grayFooter}>
                        <span className={styles.grayFooterLabel}>
                            {intl.formatMessage(messages.version)}
                        </span>
                        <span className={styles.grayVersionValue}>
                            {versionText}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeviceBoxGray;
