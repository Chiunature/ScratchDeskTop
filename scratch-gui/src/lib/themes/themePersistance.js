// import cookie from 'cookie';

import { DEFAULT_THEME, HIGH_CONTRAST_THEME } from '.';

const PREFERS_HIGH_CONTRAST_QUERY = '(prefers-contrast: more)';
const COOKIE_KEY = 'scratchtheme';

// Dark mode isn't enabled yet
const isValidTheme = theme => [DEFAULT_THEME, HIGH_CONTRAST_THEME].includes(theme);

const systemPreferencesTheme = () => {
    if (window.matchMedia && window.matchMedia(PREFERS_HIGH_CONTRAST_QUERY).matches) return HIGH_CONTRAST_THEME;

    return DEFAULT_THEME;
};

const detectTheme = () => {
    /* const obj = cookie.parse(document.cookie) || {};
    const themeCookie = obj.scratchtheme; */
    const themeCookie = localStorage.getItem(COOKIE_KEY);
    if (themeCookie && isValidTheme(themeCookie)) return themeCookie;

    // No cookie set. Fall back to system preferences
    return systemPreferencesTheme();
};

const persistTheme = (theme, themeInfo) => {
    if (!isValidTheme(theme)) {
        throw new Error(`Invalid theme: ${theme}`);
    }

    document.body.style.setProperty("--motion-primary", themeInfo.colors.themeColor);
    document.body.style.setProperty("--modal-overlay", themeInfo.colors.modalColor);
    localStorage.setItem("themeColor", themeInfo.colors.themeColor);
    localStorage.setItem("modalColor", themeInfo.colors.modalColor);

    /* if (systemPreferencesTheme() === theme) {
        // Clear the cookie to represent using the system preferences
        document.cookie = `${COOKIE_KEY}=;path=/`;
        return;
    } */

    /* const expires = new Date(new Date().setYear(new Date().getFullYear() + 1)).toUTCString();
    document.cookie = `${COOKIE_KEY}=${theme};expires=${expires};path=/`; */
    localStorage.setItem(COOKIE_KEY, theme);
};

export {
    detectTheme,
    persistTheme
};
