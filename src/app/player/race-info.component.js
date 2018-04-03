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
var RaceInfoComponent = (function () {
    function RaceInfoComponent(cs) {
        this.cs = cs;
    }
    RaceInfoComponent.prototype.ngOnChanges = function (changes) {
        var change = changes["raceName"];
        if (!change)
            return;
        if (typeof change.currentValue !== 'string' || change.currentValue.length <= 0)
            return;
        this.race = this.cs.getRace(change.currentValue);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RaceInfoComponent.prototype, "raceName", void 0);
    RaceInfoComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'race-info',
            templateUrl: './race-info.component.html',
            styleUrls: [],
            providers: [character_service_1.CharacterService],
        }), 
        __metadata('design:paramtypes', [character_service_1.CharacterService])
    ], RaceInfoComponent);
    return RaceInfoComponent;
}());
exports.RaceInfoComponent = RaceInfoComponent;
//# sourceMappingURL=race-info.component.js.map