const Store = require('electron-store');

class StoreUtil {
    constructor({ configName = 'myapp', fileExtension = 'json', defaults = {}, encryptionKey = null }) {
        this.store = new Store({
            name: configName,
            defaults,
            encryptionKey,
            fileExtension,
            // cwd: path.dirname(customPath),
            // configName: path.basename(customPath),
        });
        for (const key in defaults) {
            if (!this.store.has(key)) {
                this.set(key, defaults[key]);
            }
        }
    }

    getPath = () => {
        return this.store.path;
    }

    set = (key, value) => {
        if (value instanceof Date) {
            value = value.toISOString();
        }
        return this.store.set(key, value);
    }

    get = (key, defaultValue = null) => {
        const rawValue = this.store.get(key);
        if (!rawValue && defaultValue) {
            return defaultValue;
        }
        try {
            if (typeof defaultValue === 'string' && defaultValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/)) {
                return new Date(rawValue);
            }
        } catch (error) {
            console.info(`Error converting value for key ${key}:`, error);
        }

        return rawValue;
    }

    delete = (key) => {
        return this.store.delete(key);
    }

    clear = () => {
        return this.store.clear();
    }

    has = (key) => {
        return this.store.has(key);
    }
}

module.exports = StoreUtil;
