import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from './cascader.css';
import Box from '../box/box.jsx';
import CascaderComList from './CascaderComList.jsx';
import { initOptions } from './Cascader.js';
import { ipc as ipc_Render } from 'est-link';
import message from '../device/deviceMsg';

const Portal = ({ children }) => typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;



const filterPlaceholder = {
  id: 'gui.device.updatePlaceHolder',
  defaultMessage: 'Please select a port and device',
  description: 'Please select a port and device'
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
      if (!cascaderRef?.current) {
        return;
      }
      if (!cascaderRef?.current?.contains(e.target) && e?.target?.className?.indexOf(styles.inpSpan) === -1) {
        cascaderRef.current.style.display = 'none';
        return;
      }
      const { x, y } = inpRef.current.getBoundingClientRect();
      cascaderRef.current.style.left = `${x}px`;
      cascaderRef.current.style.top = `${y + inpRef.current.offsetHeight}px`;
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
    if (valList.length === 0 || !props.peripheralName) {
      return;
    }
    const dataList = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
    for (const item of valList) {
      const newItem = item[0].split('/');
      const index = getIndex(newItem[0]);
      switch (newItem[1]) {
        case props.intl.formatMessage(message.big_motor):
          dataList[index] = 0xA1;
          break;
        case props.intl.formatMessage(message.small_motor):
          dataList[index] = 0xA6;
          break;
        case props.intl.formatMessage(message.color):
          dataList[index] = 0xA2;
          break;
        default:
          break;
      }
    }
    window.myAPI.ipcRender({ sendName: ipc_Render.SEND_OR_ON.SENSING_UPDATE, sendParams: [...dataList] });
  }

  return (
    <>
      {
        props.peripheralName && <Box className={styles.cascaderBox}>
          <label className={classNames(filterQuery.length > 0 ? styles.tooltip : '')} title={filterQuery}>
            <input className={styles.inpSpan}
              type="text"
              ref={inpRef}
              readOnly
              value={filterQuery}
              placeholder={props.intl.formatMessage(filterPlaceholder)}
              onMouseUp={clickCascader}
            />
          </label>
          <button className={styles.btn} ref={btnRef} onClick={updateSensing}>强制外设更新</button>
          <Portal>
            <CascaderComList intl={props.intl} cascaderRef={cascaderRef} initOptions={initOptions} setFilterQuery={setFilterQuery} valList={valList} setValList={setValList} />
          </Portal>
        </Box>
      }
    </>
  );
};

export default CascaderCom;
