import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from './cascader.css';
import Box from '../box/box.jsx';
import CascaderComList from './CascaderComList.jsx';
import { options } from './Cascader.js';
import { ipc as ipc_Render } from 'est-link';


const Protal = ({ children }) => typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;



const filterPlaceholder = {
  id: 'gui.library.filterPlaceholder',
  defaultMessage: 'Search',
  description: 'Placeholder text for library search field'
}

const CascaderCom = (props) => {
  let inpRef = useRef();
  let cascaderRef = useRef();
  let btnRef = useRef();
  let [filterQuery, setFilterQuery] = useState('');
  let [valList, setValList] = useState([]);

  useEffect(() => {
    document.addEventListener('mouseup', clickCascader);

    return () => {
      document.removeEventListener('mouseup', clickCascader);
    }
  }, []);

  function clickCascader(e) {
    if (e) {
      if (!cascaderRef.current.contains(e.target) && e.target.className.indexOf(styles.fileInpSpan) === -1) {
        cascaderRef.current.style.display = 'none';
        return;
      }
      const { x, y } = inpRef.current.getBoundingClientRect();
      cascaderRef.current.style.left = `${x}px`;
      cascaderRef.current.style.top = `${y + 25}px`;
      cascaderRef.current.style.display = 'block';
    } else {
      cascaderRef.current.style.display = 'none';
    }
  }

  function preventDefaultEvents(e) {
    if (e) {
      e?.persist();
      e?.stopPropagation();
      e?.nativeEvent?.stopImmediatePropagation();
    }
  }

  function getIndex(data) {
    const portList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return portList.indexOf(data);
  }

  function updateSensing(e) {
    preventDefaultEvents(e);
    const dataList = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
    const index = getIndex(valList[0]);
    switch (valList[1]) {
      case '大电机':
        dataList[index] = 0xA1;
        break;
      case '小电机':
        dataList[index] = 0xA6;
        break;
      case '颜色识别器':
        dataList[index] = 0xA2;
        break;
      default:
        break;
    }
    window.myAPI.ipcRender({ sendName: ipc_Render.SEND_OR_ON.SENSING_UPDATE, sendParams: [...dataList] });
  }

  return (
    <Box className={styles.cascaderBox}>
      <input className={classNames(styles.fileInpSpan)}
        type="text"
        ref={inpRef}
        readOnly
        value={filterQuery}
        placeholdertext={props.intl.formatMessage(filterPlaceholder)}
        onMouseUp={clickCascader}
      />
      <button className={styles.btn} ref={btnRef} onClick={updateSensing}>强制外设更新</button>
      <Protal>
        <CascaderComList cascaderRef={cascaderRef} options={options} setFilterQuery={setFilterQuery} valList={valList} setValList={setValList} />
      </Protal>
    </Box>
  );
};

export default CascaderCom;