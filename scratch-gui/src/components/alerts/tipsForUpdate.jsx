import React from "react";
import styles from './tips.css';
import classNames from 'classnames';

const TipsForUpdate = ({ tipsUpdateObj }) => {
    return (<>
        {
            tipsUpdateObj && <div className={classNames(styles.tipsBox, parseInt(tipsUpdateObj.percent) === 100 ? styles.tipsSuccess : '')}>
                <p>{parseInt(tipsUpdateObj.percent) === 100 ? '下载更新完成，请重启软件!' : '检测到更新，安装包下载中...'}</p>
                <div>
                    {tipsUpdateObj.speed && <span>网速: {tipsUpdateObj.speed >= 1000 ? (tipsUpdateObj.speed / 1000).toFixed(1) + 'MB/S' : tipsUpdateObj.speed + 'KB/S'}</span>}
                    <span>进度: {tipsUpdateObj.percent}%</span>
                </div>
            </div>
        }
    </>)
}

export default TipsForUpdate;