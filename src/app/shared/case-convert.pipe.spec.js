"use strict";
var case_convert_pipe_1 = require('./case-convert.pipe');
describe('CaseConvertPipe transform function', function () {
    var ccp = new case_convert_pipe_1.CaseConvertPipe();
    var testCases = [
        ["thisIsATest", "KC", "KebabCase", "this-is-a-test"],
        ["this-is-a-test", "CC", "CamelCase", "thisIsATest"],
        ["thisIsATest", "FC", "FirstCap", "This is a test"],
        ["thisIsATest", "IC", "InitialCaps", "This Is A Test"],
        ["thisIsATest", "FC", "FirstCap", "This is a test"],
        ["ThisIsATest", "LSC", "LowrSnakeCase", "this_is_a_test"],
        ["thisIsATest", "USC", "UpperSnakeCase", "THIS_IS_A_TEST"],
    ];
    testCases.forEach(function (spec) {
        it("transforms \"" + spec[0] + "\" to \"" + spec[3] + "\" in " + spec[2], function () {
            expect(ccp.transform(spec[0], spec[1])).toBe(spec[3]);
        });
    });
});
describe("CaseConvertPipe getWordArray Function", function () {
    var ccp = new case_convert_pipe_1.CaseConvertPipe();
    var testCases = [
        ["this-is-a-test", ['this', 'is', 'a', 'test']],
        ["thisIsATest", ['this', 'is', 'a', 'test']],
        ["THIS_IS_A_TEST", ['this', 'is', 'a', 'test']],
    ];
    testCases.forEach(function (spec) {
        it("parses \"" + spec[0] + "\" to \"" + JSON.stringify(spec[1]) + "\"", function () {
            var parsedArray = ccp.getWordArray(spec[0]);
            expect(parsedArray).toEqual(spec[1]);
        });
    });
});
//# sourceMappingURL=case-convert.pipe.spec.js.map