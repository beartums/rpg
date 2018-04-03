import { Pipe, PipeTransform } from '@angular/core';

import { CaseConvertPipe } from './case-convert.pipe';

describe('CaseConvertPipe transform function', function () {
  let ccp = new CaseConvertPipe();
	let testCases = [
		[ "thisIsATest", "KC", "KebabCase", "this-is-a-test"],
		[ "this-is-a-test", "CC", "CamelCase", "thisIsATest"],
		[ "thisIsATest", "FC", "FirstCap", "This is a test"],
		[ "thisIsATest", "IC", "InitialCaps", "This Is A Test"],
		[ "thisIsATest", "FC", "FirstCap", "This is a test"],
		[ "ThisIsATest", "LSC", "LowrSnakeCase", "this_is_a_test"],
		[ "thisIsATest", "USC", "UpperSnakeCase", "THIS_IS_A_TEST"],
	];

	testCases.forEach(spec => {
		it (`transforms "${spec[0]}" to "${spec[3]}" in ${spec[2]}`, () => {
			expect(ccp.transform(spec[0],spec[1])).toBe(spec[3]);
		});
	});
});

describe("CaseConvertPipe getWordArray Function", function() {
	let ccp = new CaseConvertPipe();
	let testCases = [
		["this-is-a-test", ['this','is','a','test']],
		["thisIsATest", ['this','is','a','test']],
		["THIS_IS_A_TEST", ['this','is','a','test']],
	];

	testCases.forEach(spec => {
		it (`parses "${spec[0]}" to "${JSON.stringify(spec[1])}"`, () => {
			let parsedArray: string[] = ccp.getWordArray(<string>spec[0]);
			expect(parsedArray).toEqual(spec[1]);
		});
	})

});
