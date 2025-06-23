import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { defineMessages } from "react-intl";
import bindAll from 'lodash.bindall';
import BleListModalCom from '../components/ble-list/ble-list-modal.jsx';
import { closeBleListModal } from "../reducers/modals.js";
import { showAlertWithTimeout } from "../reducers/alerts.js";
import { setDeviceType } from "../reducers/device.js";
import {
    clearConnectionModalPeripheralName,
    getSerialList,
    setCompleted,
    setConnectionModalPeripheralName,
    setPort,
    ChangeSerialList
} from "../reducers/connection-modal.js";
import { ipc as ipc_Renderer, verifyTypeConfig } from 'est-link';

const messages = defineMessages({
    connectBtn: {
        id: "gui.connection.connect",
        description: "Connect",
        defaultMessage: "Connect",
    },
    disconnectBtn: {
        id: "gui.connection.disconnect",
        description: "Disconnect",
        defaultMessage: "Disconnect",
    },
    connectedBtn: {
        id: "gui.connection.connected",
        description: "Connected",
        defaultMessage: "Connected",
    },
    unsupportedDevice: {
        id: "gui.connection.unsupportedDevice",
        description: "Unknown or unsupported devices",
        defaultMessage: "Unknown or unsupported devices",
    },
    bluetooth: {
        defaultMessage: "Bluetooth",
        description: "Bluetooth",
        id: "gui.connection.bluetooth"
    },
    connectedBle: {
        defaultMessage: "Connected Bluetooth: ",
        description: "Connected Bluetooth: ",
        id: "gui.connection.connectedBle"
    }
});

class BleListModal extends PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleCancel',
            "handleGetBleList",
            "scanBle",
            "noScanBle",
            "handleSelectPort",
            "handleBleScan",
            "handleBleDisconnect",
            "initBleCacheList",
            "handleSelectCache",
            "deleteSelectCache"
        ]);
        this.state = {
            bleList: [],
            bleCacheList: [],
            selectedCache: null,
            selectedBle: { ...this.props.port } || null,
        }
    }

    componentDidMount() {
        !this.props.peripheralName && this.scanBle();
        this.initBleCacheList();
    }

    componentWillUnmount() {
        !this.props.peripheralName && this.props.onSetDeviceType(verifyTypeConfig.SERIALPORT);
        this.noScanBle();
        window.myAPI.delEvents([ipc_Renderer.RETURN.BLE.GETBlELIST, ipc_Renderer.RETURN.BLE.CONNECTION, ipc_Renderer.RETURN.BLE.SCANNING]);
    }

    initBleCacheList() {
        const MAClist = localStorage.getItem('MAClist');
        if (MAClist) {
            const cacheList = JSON.parse(MAClist);
            this.setState({
                bleCacheList: cacheList,
                selectedCache: cacheList[0]
            });
        }
    }

    handleCancel() {
        this.props.onCancel();
    }

    scanBle() {
        this.handleGetBleList();
        this.handleBleScan(true);
    }

    noScanBle() {
        this.handleBleScan(false);
        if (!this.props.peripheralName) {
            this.setState({
                bleList: []
            });
        }
    }

    handleBleScan(open) {
        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.BLE.SCANNING,
            sendParams: open,
            eventName: ipc_Renderer.RETURN.BLE.SCANNING,
            callback: (e, res) => {
                this.props.onShowConnectAlert(res.msg);
            }
        });
    }

    handleGetBleList() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.RETURN.BLE.GETBlELIST,
            callback: (e, ble) => {
                const bleItem = JSON.parse(ble);
                if (this.state.bleList.find(item => item.id === bleItem.id)) return;
                this.setState(() => {
                    return {
                        bleList: [bleItem, ...this.state.bleList]
                    }
                });
            }
        });
    }

    async handleSelectPort(port) {
        if (this.props.completed || this.props.peripheralName || port.state === 'connected') {
            return;
        }

        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.BLE.CONNECTION,
            sendParams: port,
            eventName: ipc_Renderer.RETURN.BLE.CONNECTION,
            callback: (e, res) => {
                const { bleType, msg, success } = res;
                this.props.onShowConnectAlert(msg);

                if (success) {
                    this.props.onSetCompleted(false);
                    this.props.onSetDeviceType(bleType);

                    // 修改状态
                    port.state = 'connected';
                    this.props.onSetPort(port);
                    this.props.onGetSerialList([port]);
                    this.props.onSetConnectionModalPeripheralName(port?.localName);

                    this.setState({
                        selectedBle: port,
                        bleList: this.state.bleList.map(item => {
                            if (item.id === port.id) {
                                item.state = 'connected';
                            }
                            return item;
                        })
                    })
                }
            }
        });
    }

    async handleBleDisconnect(port) {
        await window.myAPI.ipcInvoke(ipc_Renderer.SEND_OR_ON.BLE.DISCONNECTED);

        this.scanBle();

        this.setState({
            selectedBle: null,
            bleList: this.state.bleList.map(item => {
                if (item.id === port.id) {
                    item.state = 'disconnect';
                }
                return item;
            })
        })
    }

    deleteSelectCache() {
        if (this.state.selectedCache === this.props.currentMAC) {
            alert("当前设备已连接，无法删除");
            return;
        }

        const isDel = confirm('确定要删除该条记录吗?');
        if (!isDel) {
            return;
        }

        const cacheList = this.state.bleCacheList.filter(id => id !== this.state.selectedCache);

        this.setState({
            bleCacheList: cacheList,
            selectedCache: cacheList[0] || null
        });
        
        if (cacheList.length === 0) {
            localStorage.removeItem('MAClist');
        } else {
            localStorage.setItem('MAClist', JSON.stringify(cacheList));
        }
    }

    handleSelectCache(e) {
        this.setState({
            selectedCache: e.target.value
        });
    }

    render() {
        return (
            <BleListModalCom
                {...this.props}
                messages={messages}
                onCancel={this.handleCancel}
                bleList={this.state.bleList}
                selectedBle={this.state.selectedBle}
                handleSelectPort={this.handleSelectPort}
                handleBleDisconnect={this.handleBleDisconnect}
                bleCacheList={this.state.bleCacheList}
                handleSelectCache={this.handleSelectCache}
                deleteSelectCache={this.deleteSelectCache}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    sourceCompleted: state.scratchGui.connectionModal.sourceCompleted,
    peripheralName: state.scratchGui.connectionModal.peripheralName,
    completed: state.scratchGui.connectionModal.completed,
    port: state.scratchGui.connectionModal.port,
    currentMAC: state.scratchGui.device.currentMAC,
})
const mapDispatchToProps = (dispatch) => ({
    onCancel: () => dispatch(closeBleListModal()),
    onShowConnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onSetDeviceType: (deviceType) => dispatch(setDeviceType(deviceType)),
    onGetSerialList: (serialList) => dispatch(getSerialList(serialList)),
    onSetConnectionModalPeripheralName: (peripheralName) =>
        dispatch(setConnectionModalPeripheralName(peripheralName)),
    onClearConnectionModalPeripheralName: () =>
        dispatch(clearConnectionModalPeripheralName()),
    onSetCompleted: (completed) => dispatch(setCompleted(completed)),
    onSetPort: (port) => dispatch(setPort(port)),
    onChangeSerialList: (port) => dispatch(ChangeSerialList(port)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BleListModal);