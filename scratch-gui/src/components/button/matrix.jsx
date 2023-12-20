import React, { useEffect, useState } from "react";
import styles from "./button.css";
import matrix from "../../config/json/matrix.json";

const Matrix = ({num}) => {
    let [arr, setArr] = useState(matrix[num]);

    return (
        <ul className={styles.tb}>
            {arr.split('').map((el, index) => {
              return (
                <li key={index} className={el == 1 ? styles.active : ''}></li>
              )  
            })}
        </ul>
    )
}

export default Matrix