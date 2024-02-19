import React from 'react';
import { connect } from 'react-redux';
import SelectBoxCom from '../components/box/selectBox.jsx';
import { setExelist, setSelectedExe } from '../reducers/mode.js';
import bindAll from 'lodash.bindall';

class SelectBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index: this.props.selectedExe.num,
            sx: this.props.selectedExe.num * 96
        }
        bindAll(this, ['handleRight', 'handleLeft'])
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedExe !== this.props.selectedExe) {
            this.setState(() => ({
                index: this.props.selectedExe.num,
                sx: this.props.selectedExe.num * 96
            }));
        }
    }

    changeSelectExe() {
        this.props.onSetSelectedExe({
            num: this.state.index,
            checked: true,
            name: `${this.state.index}_APP`
        });
        const newList = this.props.exeList.map((item, i) => {
            if (i === this.state.index) {
                item.checked = true;
            } else {
                item.checked = false;
            }
            return item;
        });
        this.props.onSetExelist(newList);
    }


    handleRight(ul) {
        if (this.state.index >= ul.current.children[0].children.length - 1) {
            return;
        } else {
            this.state.index++;
            this.changeSelectExe();
            this.setState((state) => ({
                sx: state.index * ul.current.offsetWidth
            }));
        }
    }

    handleLeft(ul) {
        if (this.state.index <= 0) {
            return;
        } else {
            this.state.index--;
            this.changeSelectExe();
            this.setState((state) => ({
                sx: state.index * ul.current.offsetWidth
            }));
        }
    }


    render() {
        return (<SelectBoxCom
            completed={this.props.completed}
            handleCompile={this.props.handleCompile}
            isRtl={this.props.isRtl}
            sx={this.state.sx}
            flag={this.props.flag}
            handleRight={this.handleRight}
            handleLeft={this.handleLeft}
        />)
    }
}


const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    onSetSelectedExe: (selectedExe) => dispatch(setSelectedExe(selectedExe)),
    onSetExelist: (exeList) => dispatch(setExelist(exeList))
});


export default connect(mapStateToProps, mapDispatchToProps)(SelectBox);