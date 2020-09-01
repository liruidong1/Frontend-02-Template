const END = Symbol('END');

class Trie {
    constructor() {
        this.root = new Map();
    }

    insert(word) {
        let node = this.root;

        for (let char of word) {
            if (!node.has(char)) {
                node.set(char, new Map());
            }

            node = node.get(char);
        }

        if (!node.has(END)) {
            node.set(END, 0);
        }

        node.set(END, node.get(END) + 1)
    }

    most() {
        let max = 0;
        let maxWord = null;
        let visit = (node, word) => {
            if(node.has(END) && node.get(END) > max) {
                max = node.get(END);
                maxWord = word;
            }

            for(let p of node.keys()) {
                if(p !== END){
                    visit(node.get(p), word+p);
                }
            }
        }

        visit(this.root, '');
        return {
            maxWord, max
        };
    }
}


function randomWord(length) {
    let s = '';
    let start = 'a'.charCodeAt(0);
    for(let i = 0; i < length; i++){
        s += String.fromCharCode(Math.random()*26 + start)
    }

    return s;
}

let trie = new Trie();
for(let i = 0; i < 100000; i++) {
    trie.insert(randomWord(4));
}

console.log(trie.most());