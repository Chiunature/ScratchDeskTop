import React from 'react';
import styles from './ble-list-modal.css';
import delImg from '../device/delete.svg';

function BleCahceList({ bleCacheList, handleSelectCache, deleteSelectCache }) {

    return (
        <>
            <label for="cacheList" style={{ whiteSpace: 'nowrap', margin: '0 5px' }}>蓝牙缓存ID列表:</label>
            {bleCacheList?.length > 0 ?
                <>
                    <select
                        name='cacheList'
                        className={styles.bleCacheList}
                        onChange={handleSelectCache}
                        placeholder='请选择一条记录'
                    >
                        {
                            bleCacheList.map((item) => {
                                return (
                                    <option key={item} value={item}>{item}</option>
                                )
                            })
                        }
                    </select>
                    <img src={delImg} alt="" className={styles.deleteImg} onClick={deleteSelectCache} />
                </> :
                <div>暂无记录</div>
            }
            
        </>
    )
}

export default BleCahceList