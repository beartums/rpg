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
var SelectByLabelComponent = (function () {
    function SelectByLabelComponent() {
        this.selectedChange = new core_1.EventEmitter();
        this.returnObject = 'true';
        this.collapseWhenSelected = 'false';
        this._returnObject = true;
        this._collapseWhenSelected = false;
    }
    SelectByLabelComponent.prototype.ngOnChanges = function (changes) {
        var returnObjectChange = changes["returnObject"];
        if (returnObjectChange && returnObjectChange.currentValue.toLowerCase) {
            this._returnObject = (returnObjectChange.currentValue.toLowerCase() !== 'false');
        }
        var collapseChange = changes["collapseWhenSelected"];
        if (collapseChange && collapseChange.currentValue.toLowerCase) {
            this._collapseWhenSelected = collapseChange.currentValue.toLowerCase() !== 'false';
        }
    };
    SelectByLabelComponent.prototype.getDisplayValue = function (obj) {
        if (!obj)
            return "";
        if (typeof obj === 'string')
            return obj;
        if (!this.displayProperty || typeof this.displayProperty != 'string' || !obj[this.displayProperty] || typeof obj[this.displayProperty] !== 'string') {
            return '!err';
        }
        return obj[this.displayProperty];
    };
    SelectByLabelComponent.prototype.isSelected = function (obj) {
        if (this._returnObject) {
            return obj === this.selected;
        }
        else {
            return this.getDisplayValue(obj) == this.selected;
        }
    };
    SelectByLabelComponent.prototype.isDisabled = function (obj) {
        if (this.disabled)
            return true;
        var isDisabled = false;
        return isDisabled;
    };
    SelectByLabelComponent.prototype.isIn = function (obj, objs) {
        if (!objs)
            return false;
        var idx = objs.indexOf(obj);
        if (idx === -1)
            return false;
        return true;
    };
    SelectByLabelComponent.prototype.isOptionVisible = function (obj) {
        if (this.isSelected(obj))
            return true;
        if (!this._collapseWhenSelected || !this.selected) {
            return true;
        }
        return false;
    };
    SelectByLabelComponent.prototype.toggleSelection = function (obj, isDisabled) {
        if (this.isDisabled(obj))
            return;
        if (this._returnObject) {
            this.selected = this.selected === obj ? null : obj;
        }
        else {
            var val = this.getDisplayValue(obj);
            this.selected = this.selected === val ? null : val;
        }
        this.selectedChange.emit(this.selected);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SelectByLabelComponent.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SelectByLabelComponent.prototype, "disabledOptions", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectByLabelComponent.prototype, "displayProperty", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SelectByLabelComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SelectByLabelComponent.prototype, "selectedChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectByLabelComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectByLabelComponent.prototype, "returnObject", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectByLabelComponent.prototype, "collapseWhenSelected", void 0);
    SelectByLabelComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'select-by-label',
            templateUrl: './select-by-label.component.html',
            styleUrls: ['./select-by-label.component.css'],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], SelectByLabelComponent);
    return SelectByLabelComponent;
}());
exports.SelectByLabelComponent = SelectByLabelComponent;
//# sourceMappingURL=select-by-label.component.js.map