import PropTypes from "prop-types";
import React from "react";
import bindAll from "lodash.bindall";
import ConnectionModalComponent, {
    PHASES,
} from "../components/connection-modal/connection-modal.jsx";
import VM from "scratch-vm";
import analytics from "../lib/analytics";
import extensionData from "../lib/libraries/extensions/index.jsx";
import { connect } from "react-redux";
import { closeConnectionModal } from "../reducers/modals";
import { showAlertWithTimeout } from "../reducers/alerts";
import {
    ChangeSerialList,
    setPort,
    setIsConnectedSerial,
    setConnectionModalPeripheralName,
    clearConnectionModalPeripheralName,
    getSerialList,
    setCompleted,
    setVersion,
} from "../reducers/connection-modal";
import { ipc, getVersion } from "../utils/ipcRender.js";
import { SOURCE } from "../config/json/verifyTypeConfig.json";
import { VERSION } from "../config/json/LB_FWLIB.json";

class ConnectionModal extends React.Component {
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
            "handleSelectport",
            "handleUpdate"
        ]);
        this.state = {
            extension: extensionData.find(
                (ext) => ext.extensionId === props.extensionId
            ),
            phase: props.vm.getPeripheralIsConnected(props.extensionId)
                ? PHASES.connected
                : PHASES.scanning,
        };
    }

    componentDidMount() {
        // this.props.vm.on("PERIPHERAL_CONNECTED", this.handleConnected);
        // this.props.vm.on("PERIPHERAL_DISCONNECTED", this.handleDisconnect);
        this.props.vm.on("PERIPHERAL_REQUEST_ERROR", this.handleError);
    }

    componentWillUnmount() {
        /* this.props.vm.removeListener(
            "PERIPHERAL_CONNECTED",
            this.handleConnected
        );
        this.props.vm.removeListener(
            "PERIPHERAL_DISCONNECTED",
            this.handleDisconnect
        ); */
        this.props.vm.removeListener(
            "PERIPHERAL_REQUEST_ERROR",
            this.handleError
        );
    }

    /* componentDidUpdate(preProps) {
        if(preProps.isConnectedSerial !== this.props.isConnectedSerial) {
            this.handleConnected();
        }
    } */

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
            ipc({ sendName: "disconnected"});
        }
    }

    handleCancel() {
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
        if(!this.props.port) return;
        this.props.onSetConnectionModalPeripheralName(this.props.port.friendlyName);
        ipc({
            sendName: "connect",
            sendParams: this.props.port,
            eventName: "connected",
            callback: (event, arg) => {
                if(arg.res) {
                    this.props.onShowConnectAlert(arg.msg);
                }else {
                    this.handleDisconnect(arg.msg);
                }
            },
        });

        // this.setState({
        //     phase: PHASES.connected,
        // });
        // analytics.event({
        //     category: "extensions",
        //     action: "connected",
        //     label: this.props.extensionId,
        // });
    }

    handleHelp() {
        window.open(this.state.extension.helpLink, "_blank");
        analytics.event({
            category: "extensions",
            action: "help",
            label: this.props.extensionId,
        });
    }

    handleSelectport(port, index) {
        this.props.onSetPort(port);
        this.props.onChangeSerialList([...this.props.serialList], index);
        this.props.onSetCompleted(false);
        this.handleConnected();
    }

    handleUpdate() {
        this.props.compile.sendSerial(null, SOURCE);
        this.props.onSetCompleted(true);
        if(!localStorage.getItem('version')) this.props.onSetVersion(getVersion(VERSION));
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
                onSelectport={this.handleSelectport}
                onUpdate={this.handleUpdate}
                completed={this.props.completed}
                getVersion={getVersion}
            />
        );
    }
}

ConnectionModal.propTypes = {
    extensionId: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    compile: PropTypes.object
};

const mapStateToProps = (state) => ({
    extensionId: state.scratchGui.connectionModal.extensionId,
    serialList: state.scratchGui.connectionModal.serialList,
    port: state.scratchGui.connectionModal.port,
    peripheralName: state.scratchGui.connectionModal.peripheralName,
    isConnectedSerial: state.scratchGui.connectionModal.isConnectedSerial,
    version: state.scratchGui.connectionModal.version,
    soundArr: state.scratchGui.connectionModal.soundArr
});

const mapDispatchToProps = (dispatch) => ({
    onCancel: () => {
        dispatch(closeConnectionModal());
    },
    onChangeSerialList: (serialList, index) =>
        dispatch(ChangeSerialList(serialList, index)),
    onSetPort: (port) => dispatch(setPort(port)),
    onSetConnectionModalPeripheralName: (peripheralName) =>
        dispatch(setConnectionModalPeripheralName(peripheralName)),
    onClearConnectionModalPeripheralName: () =>
        dispatch(clearConnectionModalPeripheralName()),
    onGetSerialList: (serialList) => dispatch(getSerialList(serialList)),
    onSetCompleted: (completed) => dispatch(setCompleted(completed)),
    onShowConnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onShowDisonnectAlert: (item) => showAlertWithTimeout(dispatch, item),
    onSetIsConnectedSerial: (isConnectedSerial) => dispatch(setIsConnectedSerial(isConnectedSerial)),
    onSetVersion: (version) => dispatch(setVersion(version))
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionModal);
