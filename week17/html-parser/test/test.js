import { parserHTML } from "../src/HtmlParser";
const assert = require('assert');

describe("parse html:", function (){

    it('<a></a>', function () {
        let tree = parserHTML('<a></a>')
        assert.equal(tree.children[0].tagName,'a')
        assert.equal(tree.children[0].children.length,0)
    })

    it('<a href="//time.geekbang.org"></a>', function () {
        let tree = parserHTML('<a href="//time.geekbang.org"></a>')
    })
})