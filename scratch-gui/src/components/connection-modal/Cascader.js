import message from '../device/deviceMsg.js';


const children = [
        {
            value: '大电机',
            label: '大电机',
            checked: false,
            msg: message.big_motor
        },
        {
            value: '中电机',
            label: '中电机',
            checked: false,
            msg: message.small_motor
        },
        {
            value: '颜色识别器',
            label: '颜色识别器',
            checked: false,
            msg: message.color
        },
]

const options = [
    {
        value: 'A',
        label: 'A',
        checked: false
    },
    {
        value: 'B',
        label: 'B',
        checked: false
    },
    {
        value: 'C',
        label: 'C',
        checked: false
    },
    {
        value: 'D',
        label: 'D',
        checked: false
    },
    {
        value: 'E',
        label: 'E',
        checked: false
    },
    {
        value: 'F',
        label: 'F',
        checked: false
    },
    {
        value: 'G',
        label: 'G',
        checked: false
    },
    {
        value: 'H',
        label: 'H',
        checked: false
    },
];

export function initOptions(intl) {
    if (!intl) {
        return;
    }
    for (const item of children) {
        item['value'] = intl.formatMessage(item.msg);
        item['label'] = intl.formatMessage(item.msg);
    }
    for (const el of options) {
        el['children'] = children;
    }
    return [...options];
}

