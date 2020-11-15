function kmp(source, pattern) {

    if(!source || !pattern){
        return -1;
    }

    let table = new Array(pattern.length).fill(0);
    let sLen = source.length;
    let pLen = pattern.length;

    //table[i] 代表模式串从0->i-1中出现的重复字符个数 所以table[0] = table[1] = 0;

    {
        let j = 1, k = 0; // j为匹配串下标 k为已匹配长度

        while (j < pLen) {

            if(pattern[j] === pattern[k]) {
                table[++j] = ++k;
            } else {
                if(k > 0) {
                    k = table[k];
                }else {
                    j++;
                }
            }
        }

    }
    
    let sIndex = 0;
    let pIndex = 0;
    while (sIndex < sLen) {

        if(source[sIndex] === pattern[pIndex]) {
            sIndex++;
            pIndex++;
        }else {
            if(pIndex > 0) {
                pIndex = table[pIndex];
            }else {
                sIndex++;
            }
        }

        if(pIndex >= pLen) {
            return sIndex - pLen;
        }
    }

    return -1;
}

console.log(kmp('abadddabc','abc'));

//a b a c d a b a b c