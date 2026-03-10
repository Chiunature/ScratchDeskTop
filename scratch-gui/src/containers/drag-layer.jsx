import {connect} from 'react-redux';
import DragLayer from '../components/drag-layer/drag-layer.jsx';
import { selectAssetDragging, selectAssetDragOffset, selectAssetDragImg } from '../selectors';

const mapStateToProps = state => ({
    dragging: selectAssetDragging(state),
    currentOffset: selectAssetDragOffset(state),
    img: selectAssetDragImg(state)
});

export default connect(mapStateToProps)(DragLayer);
