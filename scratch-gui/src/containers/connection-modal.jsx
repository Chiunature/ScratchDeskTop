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
import {
    ChangeSerialList,
    setPort,
    setConnectionModalPeripheralName,
    clearConnectionModalPeripheralName,
    getSerialList,
    setCompleted,
} from "../reducers/connection-modal";
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
        this.props.vm.on("PERIPHERAL_CONNECTED", this.handleConnected);
        this.props.vm.on("PERIPHERAL_REQUEST_ERROR", this.handleError);
    }
    componentWillUnmount() {
        this.props.vm.removeListener(
            "PERIPHERAL_CONNECTED",
            this.handleConnected
        );
        this.props.vm.removeListener(
            "PERIPHERAL_REQUEST_ERROR",
            this.handleError
        );
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
    handleDisconnect() {
        try {
            this.props.vm.disconnectPeripheral(this.props.extensionId);
        } finally {
            this.props.onClearConnectionModalPeripheralName();
            let list = this.props.serialList.map((el) => ({
                ...el,
                checked: false,
            }));
            this.props.onGetSerialList(list);
            this.props.onSetPort(null);
            window.electron.ipcRenderer.send("disconnected");
            this.props.onCancel();
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
        this.props.onSetConnectionModalPeripheralName(
            this.props.port.friendlyName
        );
        this.props.onCancel();
        window.electron.ipcRenderer.send("connected", this.props.port);
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
            />
        );
    }
}

ConnectionModal.propTypes = {
    extensionId: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
};

const mapStateToProps = (state) => ({
    extensionId: state.scratchGui.connectionModal.extensionId,
    serialList: state.scratchGui.connectionModal.serialList,
    port: state.scratchGui.connectionModal.port,
    peripheralName: state.scratchGui.connectionModal.peripheralName,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionModal);
