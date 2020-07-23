function utf8Encoding(s) {
    let arr = [];
    for (let i = 0; i < s.length; i++) {
        let code = s.charCodeAt(i);

        if (code < 0x80) {
            //一个字节存储一个
            arr.push(code);
        } else if (code < 0x800) {
            //两个字节存储 110***** 10******
            //获取高六位
            arr.push(0xC0 | (code >>> 6));
            //获取低六位
            arr.push(0x80 | (code & 0x3F));
        } else if (code < 0x10000) {
            //三个字节存储 1110**** 10****** 10******
            //获取高六位
            arr.push(0xE0 | (code >>> 12));
            arr.push(0x80 | (code >>> 6));
            //获取低六位
            arr.push(0x80 | (code & 0x3F));
        } else {
            //超过三字节的 。。。
        }
    }

    let result = new Uint8Array(arr);

    return result.buffer;
}