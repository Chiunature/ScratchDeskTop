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
            "handleBleScan"
        ]);
        this.state = {
            bleList: [],
            selectedBle: null,
        }
    }

    componentDidMount() {
        this.scanBle();
    }

    componentWillUnmount() {
        this.props.onSetDeviceType(null);
        this.noScanBle();
        window.myAPI.delEvents([ipc_Renderer.RETURN.BLE.GETBlELIST, ipc_Renderer.RETURN.BLE.CONNECTION, ipc_Renderer.RETURN.BLE.SCANNING]);
    }

    handleCancel() {
        this.props.onCancel();
    }

    scanBle() {
        if (!this.props.peripheralName) {
            this.handleGetBleList();
            this.handleBleScan(true);
        }
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
        if (this.props.peripheralName) return;
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
        if (this.props.completed || this.props.peripheralName) {
            return;
        }

        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.BLE.CONNECTION,
            sendParams: { newPort: port },
            eventName: ipc_Renderer.RETURN.BLE.CONNECTION,
            callback: (e, res) => {
                const { bleType, msg, success } = res;
                this.props.onShowConnectAlert(msg);
                if (success) {
                    this.props.onSetCompleted(false);
                    this.props.onSetDeviceType(bleType);
                    this.props.onSetPort(port);
                    this.props.onSetConnectionModalPeripheralName(port?.advertisement?.localName);
                }
            }
        });
    }

    render() {
        return (
            <BleListModalCom
                {...this.props}
                onCancel={this.handleCancel}
                messages={messages}
                bleList={this.state.bleList}
                handleSelectPort={this.handleSelectPort}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    sourceCompleted: state.scratchGui.connectionModal.sourceCompleted,
    peripheralName: state.scratchGui.connectionModal.peripheralName,
    completed: state.scratchGui.connectionModal.completed,
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