import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import styles from "./box.css";
import matrix from "../../config/json/matrix.json";
import rightArrow from "../cards/icon--next.svg";
import leftArrow from "../cards/icon--prev.svg";
import Matrix from "../button/matrix.jsx";
import upload from "../button/icon--upload.svg";

const SelectBoxCom = (props) => {
    const { sx, flag, isRtl, handleRight, handleLeft, handleCompile } = props;
    const [arr, setArr] = useState(Object.keys(matrix));
    // let [timer, setTimer] = useState(null);
    let refUl = useRef();
    let refBox = useRef();

    return (
        <div
            className={classNames(
                styles.selectBox,
                flag ? styles.selectShow : ""
            )}
            ref={refBox}
        >
            <div className={styles.selectModal}>
                <div className={styles.selectModalContent}>
                    <div className={styles.downloadUi}>
                        <div
                            className={styles.downloadUiLeft}
                            onClick={() => handleLeft(refUl)}
                        >
                            <img
                                draggable={false}
                                src={isRtl ? rightArrow : leftArrow}
                            />
                        </div>
                        <div className={styles.downloadLi} ref={refUl}>
                            <ul style={{ transform: `translateX(-${sx}px)` }}>
                                {arr.map((el) => (
                                    <li key={el}>
                                        <Matrix
                                            ulClassName={styles.matrixUl}
                                            active={styles.active}
                                            num={el}
                                        />
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.backBtn}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div
                            className={styles.downloadUiRight}
                            onClick={() => handleRight(refUl)}
                        >
                            <img
                                draggable={false}
                                src={isRtl ? leftArrow : rightArrow}
                            />
                        </div>
                    </div>
                </div>
                <img
                    className={styles.load}
                    src={upload}
                    alt=""
                    onClick={() => handleCompile(false)}
                />
            </div>
        </div>
    );
};

export default SelectBoxCom;
