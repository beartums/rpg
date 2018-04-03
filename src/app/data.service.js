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
var constants_1 = require('./constants');
var DataService = (function () {
    function DataService() {
    }
    DataService.prototype.getClass = function (key, prop) {
        if (prop === void 0) { prop = "name"; }
        var charClass = this.getObjectByProperty(constants_1.CLASSES, prop, key);
        if (!charClass) {
            throw "Could not find a class with property (" + prop + ") equal to '" + key + "'";
        }
        return charClass;
    };
    DataService.prototype.getClasses = function () {
        return constants_1.CLASSES;
    };
    DataService.prototype.getClassGroup = function (className) {
        for (var i = 0; i < constants_1.CLASS_GROUP_XREF.length; i++) {
            if (constants_1.CLASS_GROUP_XREF[i][0] == className)
                return constants_1.CLASS_GROUP_XREF[i][1];
        }
        return null;
    };
    /**
     * Search an array of objects and return the object with the matching property
         * @param  {any[]}  objArray  Array of objects to Search
         * @param  {string} property  Name of property to compared
         * @param  {any}    propValue Value that property should matching
         * @return {any}              First object encountered with the specified property = to the specified value
         */
    DataService.prototype.getObjectByProperty = function (objArray, property, propValue) {
        for (var i = 0; i < objArray.length; i++) {
            if (objArray[i][property] == propValue)
                return objArray[i];
        }
        return null;
    };
    DataService.prototype.getRace = function (key, prop) {
        if (prop === void 0) { prop = "name"; }
        var race = this.getObjectByProperty(constants_1.RACES, prop, key);
        if (!race) {
            throw "Could not find a Race with property (" + prop + ") equal to '" + key + "'";
        }
        return race;
    };
    DataService.prototype.getRaces = function () {
        return constants_1.RACES;
    };
    DataService.prototype.getSavingThrow = function (savingThrowName, className, level) {
        if (level === void 0) { level = 1; }
        var classGroup = this.getClassGroup(className);
        var savingThrows = this.getSavingThrowTargetArray(savingThrowName, classGroup);
        var savingThrow = savingThrows[level];
        return savingThrow;
    };
    DataService.prototype.getSavingThrowAttributeMod = function (stName, attributes) {
        // xref table looks up ability (in this case, stName + 'SavingThrow'), if
        // no value is found, this saving throw does not have an attribute-based modifiers
        var xref = constants_1.ATTRIBUTE_ABILITY_MODIFIERS_XREF;
        var xrefLookup = xref[stName + 'SavingThrow'];
        if (!xrefLookup)
            return 0;
        // Otherwise, lookup the attribute used for this modifier
        var attribute = this.getObjectByProperty(attributes, 'key', xrefLookup.attribute);
        var attValue = attribute.value;
        // get the appropriate modifier table
        var modifiers = constants_1.ATTRIBUTE_ABILITY_MODIFIERS[xrefLookup.key];
        // pull and return appropriate value
        var modValue = modifiers[attValue];
        return modValue;
    };
    DataService.prototype.getSavingThrowClassMod = function (stName, className) {
        var charClass = this.getClass(className);
        if (!charClass)
            return 0;
        var savingThrowMods = charClass.savingThrowMods;
        if (!savingThrowMods)
            return 0;
        var savingThrowMod = savingThrowMods[stName];
        if (!savingThrowMod)
            return 0;
        return savingThrowMod;
    };
    DataService.prototype.getSavingThrowNames = function () {
        return constants_1.SAVING_THROW_NAMES;
    };
    DataService.prototype.getSavingThrowRaceMod = function (stName, raceName) {
        var race = this.getRace(raceName);
        var savingThrowMods = race.savingThrowMods;
        if (!savingThrowMods)
            return 0;
        var savingThrowMod = savingThrowMods[stName];
        if (!savingThrowMod)
            return 0;
        return savingThrowMod;
    };
    DataService.prototype.getSavingThrowTargetArray = function (stName, classGroup) {
        var classSavingThrows = constants_1.SAVING_THROWS[classGroup];
        var savingThrows = classSavingThrows[stName];
        return savingThrows;
    };
    DataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map