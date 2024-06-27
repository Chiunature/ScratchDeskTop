import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CascaderPanelModalCom from '../components/cascader-panel/cascader-panel-modal.jsx';
import { closeCascaderPanelModal } from "../reducers/modals";
import { initOptions } from '../components/cascader-panel/Cascader.js';
import bindAll from 'lodash.bindall';

class CascaderPanelModal extends PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, ['handleCancel']);
    }

    handleCancel() {
        if (this.props.sourceCompleted) {
            document.body.setAttribute("style", "cursor: wait");
            return;
        }
        this.props.onCancel();
    }

    render() {
        return (
            <CascaderPanelModalCom
                {...this.props}
                initOptions={initOptions}
                onCancel={this.handleCancel}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    sourceCompleted: state.scratchGui.connectionModal.sourceCompleted
})
const mapDispatchToProps = (dispatch) => ({
    onCancel: () => dispatch(closeCascaderPanelModal()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CascaderPanelModal);