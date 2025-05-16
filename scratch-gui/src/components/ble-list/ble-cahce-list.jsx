import React from 'react';
import styles from './ble-list-modal.css';
import delImg from '../device/delete.svg';

function BleCahceList({ bleCacheList, handleSelectCache, deleteSelectCache }) {

    return (
        <>
            {/* <label for="cacheList" style={{ whiteSpace: 'nowrap', margin: '0 5px' }}>蓝牙缓存ID列表:</label> */}
            <select
                name='cacheList'
                className={styles.bleCacheList}
                onChange={handleSelectCache}
            >
                <optgroup label="蓝牙缓存ID">
                    {
                        bleCacheList.map((item) => {
                            return (
                                <option key={item} value={item}>{item}</option>
                            )
                        })
                    }
                </optgroup>
            </select>
            <img src={delImg} alt="" className={styles.deleteImg} onClick={deleteSelectCache} />
        </>
    )
}

export default BleCahceList