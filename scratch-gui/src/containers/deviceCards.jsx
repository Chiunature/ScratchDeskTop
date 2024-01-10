import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {
    activateDeck,
    setDeviceCards
} from '../reducers/cards';
import { ipcInvoke, delEvents } from "../utils/ipcRender.js";
import CardsComponent from '../components/cards/deviceCards.jsx';
import { loadImageData } from '../lib/libraries/decks/translate-image.js';
import { showAlertWithTimeout } from "../reducers/alerts";
import { ipc as ipc_Renderer } from "est-link";

class DeviceCards extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.index = 0;
        this.state = {
            deviceObj: {
                deviceList: [],
                gyroList: [],
                flashList: [],
                adcList: [],
                voice: null
            },
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
            that.watchDevice();
        }, 100);
    }
    componentDidUpdate(prevProps) {
        if (this.props.locale !== prevProps.locale) {
            loadImageData(this.props.locale);
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        delEvents(ipc_Renderer.RETURN.DEVICE.WATCH);
        this.handleStopWatch(true);
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
                deviceId: null,
                sensing_device: '无设备连接'
            }
            list.push(obj);
        }
        this.state.deviceObj.deviceList = list;
        this.setState((state) => ({ deviceObj: state.deviceObj }));
    }

    //开启监听
    async watchDevice() {
        const result = await ipcInvoke(ipc_Renderer.SEND_OR_ON.DEVICE.WATCH, { stopWatch: this.state.stopWatch });
        if (!result) return;
        const deviceObj = { ...result, deviceList: result.deviceList.length > 0 ? result.deviceList : this.state.deviceObj.deviceList };
        this.setState(() => ({ deviceObj }));
    }

    render() {
        return (
            <CardsComponent handleStopWatch={this.handleStopWatch.bind(this)}  {...this.props} deviceObj={this.state.deviceObj} />
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
    onShowDelExeAlert: (item) => showAlertWithTimeout(dispatch, item),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceCards);
