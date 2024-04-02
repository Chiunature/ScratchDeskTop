import React from "react";
import styles from './tips.css';

const TipsForUpdate = ({ tipsUpdateObj }) => {
    return (<>
        {
            tipsUpdateObj && <div className={styles.tipsBox}>
                <p>检测到更新，安装包下载中...</p>
                <div>
                    {tipsUpdateObj.speed && <span>网速: {tipsUpdateObj.speed}kb/s</span>}
                    <span>进度: {tipsUpdateObj.percent}%</span>
                </div>
            </div>
        }
    </>)
}

export default TipsForUpdate;