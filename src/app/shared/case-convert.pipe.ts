import { Pipe, PipeTransform } from '@angular/core';
/*
 * Format text into standard formats
 * 	LSC - lower_snake_case
 *  USC - UPPER_SNAKE_CASE
 *  PC - PascalCase
 *  CC - camelCase
 *  IC - Initial Caps
 *  FC - First cap only
 *  KC - kebab-case
 *
 * ASSUME:
 * 		-incoming string is properly in one of the above formats
 * 		-internal '-' will ONLY indicate word delimiter and not retained
 * 		-Embedded Acronyms 'innerHTML' will use camel case: 'innerHtml'
*/
@Pipe({name: 'caseConvert'})
export class CaseConvertPipe implements PipeTransform {
  transform(value: string, format: string): string {
		const joinStrings = {KC: "-", USC: "_", LSC: "_", CC: "", PC: "", FC: " ", IC: " " };
		let joinString:string  = joinStrings[format];
		// match null or undefined
		if (joinString == null) throw `Invalid convert-to case (${format})`;

  	let words = this.getWordArray(value);
		let output: string = ""
		if ("LSC,KC".indexOf(format) > -1) {
			output = words.join(joinString).toLowerCase();
		} else if (format==="USC") {
			output =  words.join(joinString).toUpperCase();
		} else {
			let letters: string[] = [];
			for (let i = 0; i < words.length; i++) {
					if ((i == 0 && ["FC","IC","PC"].indexOf(format)>-1) ||
							(i > 0 && ["IC","PC","CC"].indexOf(format)>-1)){
						letters = words[i].split("");
						words[i] = letters[0].toUpperCase() + letters.slice(1).join("");
					}
			}
			output = words.join(joinString);
		}
		return output;
	}

	/**
	 * Accept input a word or phrase in one of the common cases and return an array of separate words
	 * @param  {string}   phrase Word or phrase in one of the accepted cases
	 * @return {string[]}    Input broken up into an array of separare words
	 */
	getWordArray(phrase: string): string[] {
		// RegExp to find instances where a non-blank character preceeds a capital letter
		let re = /([^\s])([A-Z])/g;

		// Assume that "_" implies coming in as snake case; lowercase so that the space-insertion works later
		if (phrase.indexOf("_")>-1) phrase = phrase.toLowerCase();

		// get rid of double spaces and replace all _ and - with spaces
		phrase = phrase.trim().replace("  ", " ").replace(/_/g, " ").replace(/-/g," ");
		// Insert a space between all small-letter/capital-letter concatenations
		// While loop necessary to catch the AT in ThisIsATest, since it appears that
		// a capture cannot be a member of two groups at the same time
		do {
			phrase = phrase.replace(re,"$1 $2").replace(re,"$1 $2");
		} while (re.test(phrase));

		return phrase.toLowerCase().split(" ");
	}
}
