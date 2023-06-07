/*
 * @Description: New features
 * @Author: jiang
 * @Date: 2023-06-05 14:43:50
 * @LastEditors: jiang
 * @LastEditTime: 2023-06-06 14:42:06
 */
function toArrayBuffer(buf) {    
	let view = [];
    for (let i = 0; i < buf.length; ++i) {
        view.push(buf[i]);
    }
    return view;
}
function Get_CRC(data){
	let arr = [];
	if(!Array.isArray(data)) { 
		arr = toArrayBuffer(data);
	}else {
		arr = [...data];
	}
	if(data.length < 8) {
		let crc = 0;
		for(let i = 0;i < data.length;i++){
			crc+=data[i];			  
		}
		crc &= 0xff;
		arr.push(crc);
	}
	return arr;
}

module.exports = Get_CRC;