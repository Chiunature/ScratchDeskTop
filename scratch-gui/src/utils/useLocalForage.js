const localforage = require("localforage");

class UseLocalForage {
    constructor(name = "myapp") {
        this.lf = localforage.createInstance({
            name,
            driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE, localforage.WEBSQL]
        });
    }

    drop(options) {
        return new Promise((resolve) => {
            this.lf.dropInstance(options).then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            })
        })
    }

    setDriver(name) {
        this.lf.setDriver(name);
    }

    async getForage(key) {
        try {
            const value = await this.lf.getItem(key);
            return value;
        } catch (error) {
            return null;
        }
    }

    setForage(key, value, func) {
        return new Promise((resolve, reject) => {
            this.lf.setItem(key, value)
                .then((res) => {
                    if (typeof func === 'function') {
                        func.apply(this, res, ...args);
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    async removeForage(key) {
        try {
            const result = this.lf.removeItem(key);
            return result;
        } catch (error) {
            return null;
        }
    }

    clear() {
        return new Promise((resolve, reject) => {
            this.lf.clear().then(() => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        })
    }

    async getLength() {
        try {
            const len = await this.lf.length();
            return len;
        } catch (error) {
            return null;
        }
    }

    ready() {
        return new Promise((resolve, reject) => {
            this.lf.ready().then(function () {
                const dr = this.lf.driver();
                resolve(dr);
            }).catch(reject);
        })
    }

    supports(name) {
        return this.lf.supports(name);
    }

}

module.exports = UseLocalForage;