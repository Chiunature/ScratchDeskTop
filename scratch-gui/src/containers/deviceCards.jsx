import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {
    activateDeck,
    setDeviceCards
} from '../reducers/cards';
import { ipc } from "../utils/ipcRender.js";
import CardsComponent from '../components/cards/deviceCards.jsx';
import { loadImageData } from '../lib/libraries/decks/translate-image.js';

const list = [
    [0x5A, 0x97, 0x98, 0x01, 0xD0, 0x01, 0x5B, 0xA5], //电机
    [0x5A, 0x97, 0x98, 0x01, 0xD6, 0x01, 0x61, 0xA5], //颜色
    [0x5A, 0x97, 0x98, 0x01, 0xD2, 0x01, 0x5D, 0xA5], //超声波
    [0x5A, 0x97, 0x98, 0x01, 0xD8, 0x01, 0x63, 0xA5], //端口
];

class DeviceCards extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.index = -1;
        this.state = {
            deviceList: []
        }
    }

    componentDidMount() {
        if (this.props.locale !== 'en') {
            loadImageData(this.props.locale);
        }
        this.initDeviceList();
        const that = this;
        this.timer = setInterval(() => {
            that.index = that.index === list.length - 1 ? 0 : that.index + 1;
            that.watchDevice(that.index);
        }, 500);
    }
    componentDidUpdate(prevProps) {
        if (this.props.locale !== prevProps.locale) {
            loadImageData(this.props.locale);
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    //初始化设备
    initDeviceList() {
        let list = [];
        for (let i = 0; i < 8; i++) {
            const obj = {
                port: i,
                motor: {},
                color: {},
                sensing_device: '无设备连接'
            }
            list[i] = obj;
        }
        this.setState({ deviceList: list });
    }

    //区分什么设备,什么端口
    distinguishDevice(arr) {
        let { deviceList } = this.state;
        if (!arr || deviceList.length === 0) return;
        switch (this.index) {
            case 0:
                deviceList[arr[0]].motor = {
                    speed: arr[1],
                    aim_speed: arr[2],
                    direction: arr[3] == 1 ? '正转' : arr[3] == 2 ? '反转' : arr[3] == 3 ? '刹车' : '停止'
                };
                deviceList[arr[0]].sensing_device = '电机';
                break;
            case 1:
                deviceList[arr[0]].color = {
                    rgb: `rgb(${arr[1]}, ${arr[2]}, ${arr[3]})`,
                    hex: `#${arr[4]}`
                };
                deviceList[arr[0]].sensing_device = '颜色识别器';
                break;
            case 2:
                deviceList[arr[0]].ultrasonic = arr[1];
                deviceList[arr[0]].sensing_device = '超声波';
                break;
            case 3:
                arr.map((item, i) => {
                    if(item == 0) {
                        deviceList[i] = {
                            port: i,
                            motor: {},
                            color: {},
                            sensing_device: '无设备连接'
                        };
                    }
                });
                break;
            default:
                break;
        }
        this.setState({ deviceList });
    }

    //开启监听
    watchDevice(index) {
        ipc({
            sendName: 'watchDevice',
            sendParams: list[index],
            eventName: 'response_watch',
            callback: (event, data) => {
                const arr = data.split('/');
                this.distinguishDevice(arr);
            }
        })
    }

    render() {
        return (
            <CardsComponent {...this.props} deviceList={this.state.deviceList} />
        );
    }
}

DeviceCards.propTypes = {
    locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    deviceCards: state.scratchGui.cards.deviceCards,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
});

const mapDispatchToProps = dispatch => ({
    onActivateDeckFactory: id => () => dispatch(activateDeck(id)),
    onSetDeviceCards: (deviceCards) => dispatch(setDeviceCards(deviceCards)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceCards);
