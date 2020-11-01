const assert = require('assert');

import {add, mul} from "../src/add";

describe("add function testing", function (){
    it('1 + 2 = 3', function() {
        assert.equal(add(1, 2), 3);
    });

    it('-5 * 2 = -10', function() {
        assert.equal(mul(-5, 2), -10);
    });
})
