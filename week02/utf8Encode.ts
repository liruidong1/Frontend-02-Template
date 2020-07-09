function encoding(s: string){
    if(window.TextEncoder){
        return new TextEncoder().encode(s);
    }else {
        let array = unescape(encodeURIComponent("中文abc")).split("");
        let result = new Uint8Array(array.length);
        for(let i = 0; i < array.length; i++){
            result[i] = array[i].charCodeAt(0);
        }
        return array;
    }
}