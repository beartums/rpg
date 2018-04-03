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
var character_service_1 = require('./character.service');
var data_service_1 = require('./data.service');
var SavingThrowChartComponent = (function () {
    function SavingThrowChartComponent(cs, ds) {
        this.cs = cs;
        this.ds = ds;
        this.changeLog = [];
        //this.race = this.ds.getRace(this.raceName);
        //this.charClass = this.ds.getClass(this.className);
    }
    SavingThrowChartComponent.prototype.ngOnChanges = function (changes) {
        if (this.raceName && this.className && this.attributes && this.level) {
            this.getSavingThrowList();
        }
        else {
            this.savingThrowList = [];
        }
    };
    SavingThrowChartComponent.prototype.getSavingThrowList = function () {
        try {
            this.savingThrowList = this.cs.getSavingThrowList(this.className, this.level, this.raceName, this.attributes);
        }
        catch (e) {
            this.savingThrowList = [];
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SavingThrowChartComponent.prototype, "raceName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SavingThrowChartComponent.prototype, "className", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SavingThrowChartComponent.prototype, "attributes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SavingThrowChartComponent.prototype, "level", void 0);
    SavingThrowChartComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'saving-throw-chart',
            templateUrl: './saving-throw-chart.component.html',
            providers: [character_service_1.CharacterService, data_service_1.DataService],
        }), 
        __metadata('design:paramtypes', [character_service_1.CharacterService, data_service_1.DataService])
    ], SavingThrowChartComponent);
    return SavingThrowChartComponent;
}());
exports.SavingThrowChartComponent = SavingThrowChartComponent;
//# sourceMappingURL=saving-throw-chart.component.js.map