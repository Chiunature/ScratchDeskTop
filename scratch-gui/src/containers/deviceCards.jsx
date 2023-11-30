import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {
    activateDeck,
    setDeviceCards
} from '../reducers/cards';
import { ipc, delEvents } from "../utils/ipcRender.js";
import CardsComponent from '../components/cards/deviceCards.jsx';
import { loadImageData } from '../lib/libraries/decks/translate-image.js';
import { showAlertWithTimeout } from "../reducers/alerts";

const list = [
    [0x5A, 0x97, 0x98, 0x01, 0xD8, 0x01, 0x63, 0xA5], //端口
    [0x5A, 0x97, 0x98, 0x01, 0xD0, 0x01, 0x5B, 0xA5], //电机
    [0x5A, 0x97, 0x98, 0x01, 0xD6, 0x01, 0x61, 0xA5], //颜色
    [0x5A, 0x97, 0x98, 0x01, 0xD2, 0x01, 0x5D, 0xA5], //超声波
    [0x5A, 0x97, 0x98, 0x01, 0xD1, 0x01, 0x5C, 0xA5], //陀螺仪
    [0x5A, 0x97, 0x98, 0x01, 0xD4, 0x01, 0x5F, 0xA5], //内存
    [0x5A, 0x97, 0x98, 0x01, 0xD5, 0x01, 0x60, 0xA5], //电池电压
    [0x5A, 0x97, 0x98, 0x01, 0xD7, 0x01, 0x62, 0xA5], //声音强度
];

class DeviceCards extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.index = -1;
        this.gyroList = [];
        this.flashList = [];
        this.adcList = [];
        this.voice = null;
        this.state = {
            deviceList: [],
            stopWatch: true
        }
    }

    componentDidMount() {
        if (this.props.locale !== 'en') {
            loadImageData(this.props.locale);
        }
        this.initDeviceList();
        const that = this;
        this.timer = setInterval(() => {
            if(that.state.stopWatch && (that.props.completed || !that.props.completed)) {
                return;
            } else if(!that.state.stopWatch) {
                that.index = that.index === list.length - 1 ? 0 : that.index + 1;
                that.watchDevice(that.index);
            }
        }, 300);
    }
    componentDidUpdate(prevProps) {
        if (this.props.locale !== prevProps.locale) {
            loadImageData(this.props.locale);
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        delEvents("response_watch");
    }
    //控制暂停监听
    handleStopWatch(stopWatch) {
        this.setState({
            stopWatch: stopWatch
        });
    }
    //初始化设备
    initDeviceList() {
        let list = [];
        for (let i = 0; i < 8; i++) {
            const obj = {
                port: i,
                motor: {},
                color: {},
                ultrasonic: null,
                sensing_device: '无设备连接'
            }
            list.push(obj);
        }
        this.setState({ deviceList: list });
    }

    //区分什么设备,什么端口
    distinguishDevice(arr) {
        let { deviceList } = this.state;
        if (!arr || deviceList.length === 0) return;
        switch (this.index) {
            case 0:
                arr.map((item, i) => {
                    if (item == 0) {
                        deviceList[i] = {
                            port: i,
                            motor: {},
                            color: {},
                            ultrasonic: null,
                            sensing_device: '无设备连接'
                        };
                    }
                });
                break;
            case 1:
                deviceList[arr[0]].motor = {
                    speed: arr[1],
                    aim_speed: arr[2],
                    direction: arr[3] == 1 ? '正转' : arr[3] == 2 ? '反转' : arr[3] == 3 ? '刹车' : '停止'
                };
                deviceList[arr[0]].sensing_device = '电机';
                break;
            case 2:
                if(arr.length < 5) return;
                deviceList[arr[0]].color = {
                    rgb: `rgb(${Math.floor(arr[1])}, ${Math.floor(arr[2])}, ${Math.floor(arr[3])})`,
                    hex: `#${arr[4]}`
                };
                deviceList[arr[0]].sensing_device = '颜色识别器';
                break;
            case 3:
                deviceList[arr[0]].ultrasonic = arr[1];
                deviceList[arr[0]].sensing_device = '超声波';
                break;
            case 4:
                this.gyroList = arr;
                break;
            case 5:
                arr[1] = arr[0] - arr[1];
                this.flashList = arr;
                break;
            case 6:
                this.adcList = arr;
                break;
            case 7:
                this.voice = arr[0];
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
            sendParams: { instruct: list[index], stopWatch: this.state.stopWatch},
            eventName: 'response_watch',
            callback: (event, data) => {
                const newArr = data.split('/').filter((el) => (el !== ''));
                this.distinguishDevice(newArr);
            }
        })
    }

    render() {
        return (
            <CardsComponent handleStopWatch={this.handleStopWatch.bind(this)}  {...this.props} voice={this.voice} deviceList={this.state.deviceList} gyroList={this.gyroList} flashList={this.flashList} adcList={this.adcList} />
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
