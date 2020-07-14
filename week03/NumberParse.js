/**
 * 将数字转为字符串
 * @param number
 * @param radix
 */
function numberToString(number, radix = 10){
    if(!number) {
        return 0;
    }

    let sign = number > 0 ? "" : "-";
    number = Math.abs(number);
    let result = '';
    let decimal = String(number).match(/\.\d+$/);
    let integer = Math.floor(number);

    if(decimal){
        decimal = decimal[0];
    }

    let hexArr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    let binaryArr = [0,1];
    let octalArr = [0,1,2,3,4,5,6,7];
    let decimalArr = [0,1,2,3,4,5,6,7,8,9];

    let arr;
    if(radix === 16) {
        arr = hexArr;
    } else if(radix === 8) {
        arr = octalArr;
    } else if(radix === 2) {
        arr = binaryArr;
    } else{
        arr = decimalArr;
    }

    while (integer > 0){
        result = String(arr[integer % radix]) + result;
        integer = Math.floor(integer / radix);
    }

    if(radix === 10) {
        result = decimal ? `${sign}${result ? result : '0'}${decimal}` : `${sign}${result}`;
    }else {
        result = `${sign}${result}`;
    }

    return  result;
}



/**
 * 将String转为十进制数字
 * @param string
 */
function stringToNumber(string){
    if(string){
        string = string.toLowerCase();
        let numberTest = /^([+\-])?(0[xob])?([0-9a-f]*)(.)?(\d*)$/;

        if(numberTest.test(string)){
            let result = numberTest.exec(string);
            //本正则表达式分为五组
            //[1] 匹配正负号
            //[2] 匹配进制标识
            //[3] 匹配整数
            //[4] 匹配小数点
            //[5] 匹配小数

            let sign = result[1] | "+";

            if(result[2]) {
                //匹配到了进制标识
                if(result[4] || !result[3]){
                    //匹配到进制标识，不支持转为小数
                    //未匹配到整数位，不能转换为有效数字
                    return NaN;
                }

                let radix = 10;
                if(result[2] === '0x') {
                    radix = 16;
                }
                if(result[2] === '0o') {
                    if(/[89abcdef]+/.test(result[3])){
                        return NaN;
                    }
                    radix = 8;
                }
                if(result[2] === '0b') {
                    if(/[^01]+/.test(result[3])){
                        return NaN;
                    }
                    radix = 2;
                }
                return parseInt(sign+result[3], radix);
            } else {
                //按十进制处理
                let test = /[abcdef]+/;
                if(test.test(result[3]) || test.test[result[5]] ||
                    (!result[3] && !result[5])){
                    //整数位或者小数位包含十六进制字符，或者整数位和小数位都没有有效数字
                    return NaN;
                }

                let integer = result[3] | '0';
                let decimal = result[5] | '0';

                if(result[4]) {
                    return parseFloat(sign + integer + '.' + decimal);
                }else{
                    return parseInt(sign + integer, 10);
                }
            }

        }

        return NaN;
    }else {
        return 0;
    }
}