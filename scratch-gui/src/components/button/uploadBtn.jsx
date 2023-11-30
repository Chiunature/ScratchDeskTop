import React from 'react';
import classNames from 'classnames';
import styles from './button.css';
import uploadIcon from "./icon--upload.svg";
import yesIcon from "./icon--yes.svg";
import ButtonComponent from "./button.jsx";
import Cirle from "./cirle.jsx";



const UploadBtn = ({completed, progress, handleCompile, isComplete}) => {
    return (
        <div className={classNames(styles.btnCon)}>
            <div className={classNames(styles.btnBox)}>
                <ButtonComponent
                    className={classNames(styles.uploadBtn)}
                    iconSrc={completed ? null : uploadIcon}
                >
                    {completed ? <p className={classNames(styles.uploadP)}>{progress}%</p> : null}
                    <Cirle completed={completed} />
                </ButtonComponent>
                <ButtonComponent
                    className={classNames(styles.yesBtn, isComplete ? '' : styles.yesBtnSpin)}
                    iconSrc={yesIcon}
                    onClick={() => handleCompile()}
                    disabled={completed}
                />
            </div>
        </div>
    )
}

export default UploadBtn;