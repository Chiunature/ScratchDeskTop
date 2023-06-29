import React, { useState, useEffect, useRef } from "react";
import { HuePicker, SketchPicker } from "react-color";
import classNames from "classnames";
import styles from "./color-picker.css";
import "../../css/colors.css";
let initColor = localStorage.getItem("themeColor")
    ? localStorage.getItem("themeColor")
    : "#4c97ff";
const ColorPicker = (props) => {
    let [color, setColor] = useState(initColor);
    let picker = useRef();
    useEffect(() => {
        addListeners();
        return () => {
            removeListeners();
        };
    }, []);
    const handleChangeComplete = (color) => {
        document.body.style.setProperty("--motion-primary", color.hex);
        setColor(color.hex);
        setStorage(color.hex);
    };
    const setStorage = (theme) => {
        localStorage.setItem("themeColor", theme);
    };
    const handleClick = (e) => {
        if (props.isPicker && !picker.current.contains(e.target)) {
            props.onSetPicker(props.isPicker);
        }
    };
    const addListeners = () => {
        document.addEventListener("mouseup", handleClick);
    };
    const removeListeners = () => {
        document.removeEventListener("mouseup", handleClick);
    };
    return (
        <div className={classNames(styles.colorPicker, props.isPicker ? '' : styles.colorHide)} ref={picker}>
            <SketchPicker color={color} onChange={handleChangeComplete} />
            <br />
            <HuePicker color={color} onChange={handleChangeComplete} />
        </div>
    );
};

export default ColorPicker;
