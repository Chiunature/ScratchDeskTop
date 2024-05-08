import { defineMessages } from 'react-intl';

const HARDWARE = 'HARDWARE';
const SOFTWARE = 'SOFTWARE';



const messages = defineMessages({
    [HARDWARE]: {
        id: 'gui.help.hardware',
        defaultMessage: 'Hardware manual',
        description: 'Hardware manual'
    },
    [SOFTWARE]: {
        id: 'gui.help.software',
        defaultMessage: 'Software manual',
        description: 'Software manual'
    }
});

const helpMap = {
    [HARDWARE]: {
        blocksMediaFolder: 'blocks-media/',
        extensions: {},
        label: messages[HARDWARE],
    },
    [SOFTWARE]: {
        blocksMediaFolder: 'blocks-media/',
        extensions: {},
        label: messages[SOFTWARE]
    }
};



export {
    HARDWARE,
    SOFTWARE,
    helpMap
};
