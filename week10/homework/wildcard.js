/**
 *
 * @param source {string | null}
 * @param pattern {string | null}
 * @returns {boolean}
 */
function match(source, pattern) {

    if(source === null || source === undefined || pattern === null || pattern === undefined) {
        return false;
    }

    let sLen = source.length, pLen = pattern.length;

    let dp = Array(pLen+1).fill(0).map(()=>new Array(sLen+1).fill(false))

    dp[0][0] = true;

    for(let pIndex = 0; pIndex < pLen; pIndex++) {
        let pChar = pattern[pIndex];
        if(pChar === '*') {
            dp[pIndex+1][0] = true;
        }else {
            break;
        }
    }

    for(let pIndex = 1; pIndex <= pLen; pIndex++) {
        let pChar = pattern[pIndex-1];
        for(let sIndex = 1; sIndex <= sLen; sIndex++) {
            if(pChar === '*') {
                dp[pIndex][sIndex] = dp[pIndex-1][sIndex] || dp[pIndex][sIndex-1];
            }else if(pChar === '?' || pChar === source[sIndex-1]) {
                dp[pIndex][sIndex] = dp[pIndex-1][sIndex-1];
            }

        }
    }

    return dp[pLen][sLen];
}

match('ss', 'ss')
