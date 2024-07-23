import PropTypes from "prop-types";
import React from "react";
import bindAll from "lodash.bindall";
// import throttle from "lodash.throttle";
import ConnectionModalComponent, {
    PHASES,
} from "../components/connection-modal/connection-modal.jsx";
import VM from "scratch-vm";
import analytics from "../lib/analytics";
import extensionData from "../lib/libraries/extensions/index.jsx";
import { connect } from "react-redux";
import { closeConnectionModal } from "../reducers/modals";
import { showAlertWithTimeout } from "../reducers/alerts";
import { setDeviceType } from "../reducers/device.js";
import {
    ChangeSerialList,
    setPort,
    setIsConnectedSerial,
    setConnectionModalPeripheralName,
    clearConnectionModalPeripheralName,
    getSerialList,
    setVersion
} from "../reducers/connection-modal";
import { ipc as ipc_Renderer, verifyTypeConfig } from "est-link";
import { HELP_DOCX, HELP_PDF } from "../config/json/LB_USER.json";
import getMainMsg from "../lib/alerts/message.js";


const FIRMWARE_VERSION = '207';
class ConnectionModal extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleScanning",
            "handleCancel",
            "handleConnected",
            "handleConnecting",
            "handleDisconnect",
            "handleError",
            "handleHelp",
            "handleUpdate",
            "handleBleConnect",
            "scanBle",
            "noScanBle",
            "handleSelectPort",
            "handleBleScan"
        ]);
        this.state = {
            extension: extensionData.find(
                (ext) => ext.extensionId === props.extensionId
            ),
            firewareVersion: parseInt(FIRMWARE_VERSION),
            phase: props.vm.getPeripheralIsConnected(props.extensionId)
                ? PHASES.connected
                : PHASES.scanning,
        };
        this.bleTimer = null;
        this.mainMsg = getMainMsg(props.intl);
    }

    componentDidMount() {
        // this.scanBle();
        // this.props.vm.on("PERIPHERAL_CONNECTED", this.handleConnected);
        // this.props.vm.on("PERIPHERAL_DISCONNECTED", this.handleDisconnect);
        this.props.vm.on("PERIPHERAL_REQUEST_ERROR", this.handleError);
        const spath = sessionStorage.getItem("static_path") || window.resourcesPath;
        const fv = window.myAPI.getVersion(spath) || FIRMWARE_VERSION;
        this.setState({ firewareVersion: parseInt(fv) });
    }

    componentWillUnmount() {
        // this.props.vm.removeListener(
        //     "PERIPHERAL_CONNECTED",
        //     this.handleConnected
        // );
        // this.props.vm.removeListener(
        //     "PERIPHERAL_DISCONNECTED",
        //     this.handleDisconnect
        // );
        this.props.vm.removeListener(
            "PERIPHERAL_REQUEST_ERROR",
            this.handleError
        );
        // !this.props.peripheralName && this.noScanBle();
    }

    componentDidUpdate(preProps) {
        if (preProps.sourceCompleted !== this.props.sourceCompleted) {
            document.body.removeAttribute("style");
        }
    }

    scanBle() {
        !this.props.peripheralName && this.handleBleConnect();
        this.bleTimer = !this.bleTimer && setInterval(() => {
            !this.props.peripheralName && this.handleBleScan();
        }, 5000);
    }

    noScanBle() {
        clearInterval(this.bleTimer);
        this.bleTimer = null;
        this.handleBleScan(false);
    }

    handleBleScan(open = true) {
        if (this.props.peripheralName) return;
        window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.BLE.SCANNING, sendParams: open });
    }

    handleBleConnect() {
        window.myAPI.ipcRender({
            eventName: ipc_Renderer.SEND_OR_ON.BLE.GETBlELIST,
            callback: (e, result) => {
                if (!result) return;
                const bleList = JSON.parse(result);
                console.log(bleList);
                this.props.onGetSerialList([...bleList]);
            }
        });
    }

    async handleSelectPort(port, index) {
        if (port.checked || this.props.completed) {
            return;
        }
        this.props.onChangeSerialList(port);
        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.BLE.CONNECTION,
            sendParams: { newPort: port, index },
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

    handleScanning() {
        this.setState({
            phase: PHASES.scanning,
        });
    }

    handleConnecting(peripheralId) {
        this.props.vm.connectPeripheral(this.props.extensionId, peripheralId);
        this.setState({
            phase: PHASES.connecting,
        });
        analytics.event({
            category: "extensions",
            action: "connecting",
            label: this.props.extensionId,
        });
    }

    handleDisconnect(msg = "disconnect") {
        try {
            this.props.vm.disconnectPeripheral(this.props.extensionId);
        } finally {
            this.props.onClearConnectionModalPeripheralName();
            this.props.onGetSerialList([]);
            this.props.onSetPort(null);
            this.props.onSetIsConnectedSerial(false);
            this.props.onShowDisonnectAlert(msg);
            // this.props.onCancel();
            window.myAPI.ipcRender({ sendName: ipc_Renderer.SEND_OR_ON.CONNECTION.DISCONNECTED });
        }
    }

    handleCancel() {
        if (this.props.sourceCompleted) {
            document.body.setAttribute("style", "cursor: wait");
            return;
        }
        try {
            // If we're not connected to a peripheral, close the websocket so we stop scanning.
            if (
                !this.props.vm.getPeripheralIsConnected(this.props.extensionId)
            ) {
                this.props.vm.disconnectPeripheral(this.props.extensionId);
            }
        } finally {
            // Close the modal.
            this.props.onCancel();
        }
    }

    handleError() {
        // Assume errors that come in during scanning phase are the result of not
        // having scratch-link installed.
        if (
            this.state.phase === PHASES.scanning ||
            this.state.phase === PHASES.unavailable
        ) {
            this.setState({
                phase: PHASES.unavailable,
            });
        } else {
            this.setState({
                phase: PHASES.error,
            });
            analytics.event({
                category: "extensions",
                action: "connecting error",
                label: this.props.extensionId,
            });
        }
    }

    handleConnected() {
        if (!this.props.port) return;
        this.props.onSetConnectionModalPeripheralName(this.props.port.friendlyName);
        window.myAPI.ipcRender({
            sendName: ipc_Renderer.SEND_OR_ON.CONNECTION.CONNECTED,
            sendParams: this.props.port,
            eventName: ipc_Renderer.RETURN.CONNECTION.CONNECTED,
            callback: (event, arg) => {
                if (arg.res) {
                    this.props.onShowConnectAlert(arg.msg);
                    this.props.onSetDeviceType(verifyTypeConfig.SERIALPORT);
                } else {
                    this.handleDisconnect(arg.msg);
                }
            },
        });
    }

    handleHelp() {
        const spath = sessionStorage.getItem("static_path") || window.resourcesPath;
        // window.open(this.state.extension.helpLink, "_blank");
        window.myAPI.getDocxUrl(spath, HELP_PDF);
        window.myAPI.getDocxUrl(spath, HELP_DOCX);
        analytics.event({
            category: "extensions",
            action: "help",
            label: this.props.extensionId,
        });
    }


    async handleUpdate() {
        if (!this.props.peripheralName) {
            this.props.onShowConnectAlert("selectADeviceFirst");
            return;
        }
        if (this.props.version === this.state.firewareVersion) {
            const res = confirm(this.mainMsg.reupdate);
            if (!res) {
                return;
            }
        }
        window.myAPI.setStoreValue('version', this.state.firewareVersion);
        this.props.compile.sendSerial({ verifyType: verifyTypeConfig.RESET_FWLIB });
        this.props.onSetSourceCompleted(true);
        this.props.onSetVersion(this.state.firewareVersion);
    }

    render() {
        return (
            <ConnectionModalComponent
                connectingMessage={
                    this.state.extension &&
                    this.state.extension.connectingMessage
                }
                connectionIconURL={
                    this.state.extension &&
                    this.state.extension.connectionIconURL
                }
                connectionSmallIconURL={
                    this.state.extension &&
                    this.state.extension.connectionSmallIconURL
                }
                connectionTipIconURL={
                    this.state.extension &&
                    this.state.extension.connectionTipIconURL
                }
                peripheralName={this.props.peripheralName}
                version={this.props.version}
                port={this.props.port}
                extensionId={this.props.extensionId}
                serialList={this.props.serialList}
                name={this.state.extension && this.state.extension.name}
                phase={this.state.phase}
                title={this.props.extensionId}
                useAutoScan={
                    this.state.extension && this.state.extension.useAutoScan
                }
                vm={this.props.vm}
                onCancel={this.handleCancel}
                onConnected={this.handleConnected}
                onConnecting={this.handleConnecting}
                onDisconnect={this.handleDisconnect}
                onHelp={this.handleHelp}
                onScanning={this.handleScanning}
                onSelectport={this.handleSelectPort}
                onUpdate={this.handleUpdate}
                sourceCompleted={this.props.sourceCompleted}
                firewareVersion={this.state.firewareVersion}
                deviceType={this.props.deviceType}
                scanBle={this.handleBleScan}
                noScanBle={this.noScanBle}
                intl={this.props.intl}
            />
        );
    }
}

ConnectionModal.propTypes = {
    extensionId: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    compile: PropTypes.object,
    deviceType: PropTypes.string,
    onChangeSerialList: PropTypes.func,
    onSetPort: PropTypes.func,
    onClearConnectionModalPeripheralName: PropTypes.func,
    onGetSerialList: PropTypes.func,
    onShowConnectAlert: PropTypes.func,
    onShowDisonnectAlert: PropTypes.func,
    onSetDeviceType: PropTypes.func,
    onSetVersion: PropTypes.func,
};

const mapStateToProps = (state) => ({
    extensionId: state.scratchGui.connectionModal.extensionId,
    serialList: state.scratchGui.connectionModal.serialList,
    port: state.scratchGui.connectionModal.port,
    peripheralName: state.scratchGui.connectionModal.peripheralName,
    isConnectedSerial: state.scratchGui.connectionModal.isConnectedSerial,
    version: state.scratchGui.connectionModal.version,
    sourceCompleted: state.scratchGui.connectionModal.sourceCompleted,
    deviceType: state.scratchGui.device.deviceType,
    completed: state.scratchGui.connectionModal.completed,
});

const mapDispatchToProps = (dispatch) => ({
    onCancel: () => dispatch(closeConnectionModal()),
    onChangeSerialList: (port) => dispatch(ChangeSerialList(port)),
    onSetPort: (port) => dispatch(setPort(port)),
    onSetConnectionModalPeripheralName: (peripheralName) =>
        dispatch(setConnectionModalPeripheralName(peripheralName)),
    onClearConnectionModalPeripheralName: () =>
        dispatch(clearConnectionModalPeripheralName()),
    onGetSerialList: (serialList) => dispatch(getSerialList(serialList)),
    onShowConnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onShowDisonnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onSetIsConnectedSerial: (isConnectedSerial) => dispatch(setIsConnectedSerial(isConnectedSerial)),
    onSetDeviceType: (deviceType) => dispatch(setDeviceType(deviceType)),
    onSetVersion: (version) => dispatch(setVersion(version)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionModal);
