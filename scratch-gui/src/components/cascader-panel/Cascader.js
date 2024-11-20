import message from '../device/deviceMsg.js';



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

function deepClone(obj) {
    return new Promise(resolve => {
        const { port1, port2 } = new MessageChannel();
        port1.onmessage = (e) => {
            resolve(e.data);
        }
        port2.postMessage(obj);
    })
}

export async function initOptions(intl) {
    if (!intl) {
        return;
    }

    for (const el of options) {
        const children = [
            {
                value: intl.formatMessage(message.big_motor),
                label: intl.formatMessage(message.big_motor),
                checked: false,
                father: el.label
            },
            {
                value: intl.formatMessage(message.small_motor),
                label: intl.formatMessage(message.small_motor),
                checked: false,
                father: el.label
            },
            {
                value: intl.formatMessage(message.color),
                label: intl.formatMessage(message.color),
                checked: false,
                father: el.label
            },
            {
                value: intl.formatMessage(message.gray),
                label: intl.formatMessage(message.gray),
                checked: false,
                father: el.label
            },
        ]
        el['children'] = children;
    }
    const newOptions = await deepClone(options);
    return newOptions;
}

