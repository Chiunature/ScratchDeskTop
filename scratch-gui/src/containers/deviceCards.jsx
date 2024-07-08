import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {
    activateDeck,
    setDeviceCards
} from '../reducers/cards';
import CardsComponent from '../components/cards/deviceCards.jsx';
import { loadImageData } from '../lib/libraries/decks/translate-image.js';
import { showAlertWithTimeout } from "../reducers/alerts";

class DeviceCards extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.locale !== 'en') {
            loadImageData(this.props.locale);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.locale !== prevProps.locale) {
            loadImageData(this.props.locale);
        }
    }

    render() {
        return (
            <CardsComponent  {...this.props}/>
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
