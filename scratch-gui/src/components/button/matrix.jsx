import React, { useState } from "react";
import classNames from "classnames";
import styles from "./button.css";
import matrix from "../../config/json/matrix.json";

const Matrix = ({num, active, ulClassName, liClassName}) => {
    let [arr, setArr] = useState(matrix[num]);
const act = active ? active : styles.active;
    return (
        <ul className={classNames(styles.tb, ulClassName)}>
            {arr.split('').map((el, index) => {
              return (
                <li key={index} className={classNames(liClassName, el == 1 ? act : '')}></li>
              )  
            })}
        </ul>
    )
}

export default Matrix