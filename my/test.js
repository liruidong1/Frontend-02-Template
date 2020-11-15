/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {

    if(!wordList || wordList.length < 1) {
        return 0;
    }

    let wordSet = new Set(wordList);
    if(!wordSet.has(endWord)) {
        return 0;
    }

    let queue = [beginWord];
    let count = 1;
    let wordLength = beginWord.length;

    while(queue.length){

        let size = queue.length;

        while (size--) {
            let current = queue.shift();
            let chars = current.split('');
            for(let i = 0; i < wordLength; i++) {
                let original = chars[i];

                for(let _char = 'a'.codePointAt(0); _char <= 'z'.codePointAt(0); _char++ ){
                    let char = String.fromCodePoint(_char);
                    if(char === original){
                        continue;
                    }

                    chars[i] = char;

                    let newString = chars.join('');
                    if(wordSet.has(newString)) {
                        if(newString === endWord) {
                            return ++count;
                        }

                        queue.push(newString);
                        wordSet.delete(newString);
                    }
                }

                chars[i] = original;
            }

        }

        ++count;
    }

    return 0;
};

/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    if(!s) {
        return 0;
    }

    //dp[i] 代表s的前i个字符串 可以解码的所有可能性
    let dp = [];
    dp[0] = 1;
    dp[1] = 1;

    let current, pre;

    for(let i = 2; i <= s.length; i++){
        if((current = s.charAt(i-1)) === '0') {
            //如果当前位置为0，前一个位置必须要被使用才行，所以不增加可能性
            pre = s.charAt(i-2);
            if(pre === '1' || pre === '2') {
                dp[i] = dp[i-2];
            } else {
                return 0;
            }
        } else if((pre = s.charAt(i-2)) === '1' || pre === '2' && current >= '1' && current <= '6') {
            dp[i] = dp[i-1] + dp[i-2];
        } else {
            dp[i] = dp[i-1];
        }
    }

    return dp[s.length];
};