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
/*
 * Format a number to enhace visusal presentation for modifiers
*/
var ModifierPipe = (function () {
    function ModifierPipe() {
    }
    ModifierPipe.prototype.transform = function (value) {
        if (value == 0)
            return '';
        if (value < 0)
            return value.toString();
        if (value > 0)
            return "+" + value;
        return '';
    };
    ModifierPipe = __decorate([
        core_1.Pipe({ name: 'modifier' }), 
        __metadata('design:paramtypes', [])
    ], ModifierPipe);
    return ModifierPipe;
}());
exports.ModifierPipe = ModifierPipe;
//# sourceMappingURL=modifier.pipe.js.map