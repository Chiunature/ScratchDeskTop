import React, { useState } from "react";
import { HuePicker, SketchPicker } from "react-color";
import classNames from "classnames";
import styles from "./color-picker.css";
import "../../css/colors.css";
let initColor = localStorage.getItem("themeColor")
    ? localStorage.getItem("themeColor")
    : "#4c97ff";
const ColorPicker = () => {
    let [color, setColor] = useState(initColor);
    const handleChangeComplete = (color) => {
        document.body.style.setProperty("--motion-primary", color.hex);
        setColor(color.hex);
        setStorage(color.hex);
    };
    const setStorage = (theme) => {
        localStorage.setItem("themeColor", theme);
    };
    return (
        <div className={classNames(styles.colorPicker)}>
            <SketchPicker color={color} onChange={handleChangeComplete} />
            {/* <br />
            <HuePicker color={color} onChange={handleChangeComplete} /> */}
        </div>
    );
};

export default ColorPicker;
