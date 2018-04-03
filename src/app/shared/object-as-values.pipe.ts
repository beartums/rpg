import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'objectAsValues'})
export class ObjectAsValuesPipe implements PipeTransform {

/**
 * Tranform a passed object into an array of objects
 * @param  {any}       transformObj This is the object to be transformed into an array
 * @param  {string ="key"}       keyName   Each key in the original object will become a property in the resulting child object and its property name will be keyName
 * @param  {string = 'value'}     valueName If the element is a primative, it will be given this property name in the resulting object
 * @return {Object[]}  Array of objects
 */
    transform(transformObj: any, keyName: string = "key", valueName: string = 'value'): Object[] {
        let keyArr: any[] = Object.keys(transformObj);
        let dataArr: any[] = [];

        keyArr.forEach((key: any) => {
					let value = transformObj[key];
					let newObj = {};

					if (!value) {
						newObj[valueName] = null;
						newObj[keyName] = key;
					} else if (typeof value === "object" && !Array.isArray(value)) {
						newObj = value;
						newObj[keyName] = key;
					} else {
            newObj[valueName] = value;
						newObj[keyName] = key;
					}
					dataArr.push(newObj);
        });

        // if(args[1]) {
        //     dataArr.sort((a: Object, b: Object): number => {
        //         return a[keyName] > b[keyName] ? 1 : -1;
        //     });
        // }

        return dataArr;
    }

}
