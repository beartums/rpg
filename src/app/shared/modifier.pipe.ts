import { Pipe, PipeTransform } from '@angular/core';
/*
 * Format a number to enhace visusal presentation for modifiers
*/
@Pipe({name: 'modifier'})
export class ModifierPipe implements PipeTransform {
  transform(value: number): string {
    if (value==0) return '';
		if (value < 0) return value.toString();
    if (value > 0) return "+" + value;
		return '';
  }
}
