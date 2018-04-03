"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ObjectAsValuesPipe = (function () {
    function ObjectAsValuesPipe() {
    }
    /**
     * Tranform a passed object into an array of objects
     * @param  {any}       transformObj This is the object to be transformed into an array
     * @param  {string ="key"}       keyName   Each key in the original object will become a property in the resulting child object and its property name will be keyName
     * @param  {string = 'value'}     valueName If the element is a primative, it will be given this property name in the resulting object
     * @return {Object[]}  Array of objects
     */
    ObjectAsValuesPipe.prototype.transform = function (transformObj, keyName, valueName) {
        if (keyName === void 0) { keyName = "key"; }
        if (valueName === void 0) { valueName = 'value'; }
        var keyArr = Object.keys(transformObj);
        var dataArr = [];
        keyArr.forEach(function (key) {
            var value = transformObj[key];
            var newObj = {};
            if (!value) {
                newObj[valueName] = null;
                newObj[keyName] = key;
            }
            else if (typeof value === "object" && !Array.isArray(value)) {
                newObj = value;
                newObj[keyName] = key;
            }
            else {
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
    };
    ObjectAsValuesPipe = __decorate([
        core_1.Pipe({ name: 'objectAsValues' }), 
        __metadata('design:paramtypes', [])
    ], ObjectAsValuesPipe);
    return ObjectAsValuesPipe;
}());
exports.ObjectAsValuesPipe = ObjectAsValuesPipe;
//# sourceMappingURL=object-as-values.pipe.js.map