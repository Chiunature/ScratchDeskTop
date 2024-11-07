function getRandomString(len = 5) {
    let str = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789',
        min = 0,
        max = str.length - 1,
        result = '';
    for (let i = 0, index; i < len; i++) {
        index = (function (func, i) {
            return func(min, max, i, func);
        })(function (min, max, i, self) {
            let indexTemp = Math.floor(Math.random() * (max - min + 1) + min), numStart = str.length - 10;
            if (i === 0 && indexTemp >= numStart) {
                indexTemp = self(min, max, i, self);
            }
            return indexTemp;
        }, i);
        result += str[index];
    }
    return result;
}

module.exports = getRandomString;