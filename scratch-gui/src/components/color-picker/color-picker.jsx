import React, { useState } from "react";
import { SketchPicker } from "react-color";
import classNames from "classnames";
import styles from "./color-picker.css";
import "../../css/colors.css";
let initColor = window.myAPI.getStoreValue("themeColor")
    ? window.myAPI.getStoreValue("themeColor")
    : "#883ec9";
const ColorPicker = (props) => {
    let [color, setColor] = useState(initColor);
    const handleChangeComplete = (color) => {
        document.body.style.setProperty("--motion-primary", color.hex);
        setColor(color.hex);
        setStorage(color.hex);
    };
    const setStorage = (theme) => {
        window.myAPI.setStoreValue("themeColor", theme);
    };
    return (
        <div className={classNames(styles.colorPicker)}>
            <SketchPicker color={color} onChange={handleChangeComplete} />
        </div>
    );
};

export default ColorPicker;
