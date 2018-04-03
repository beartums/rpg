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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var mock_names_1 = require('./mock-names');
var roll_1 = require('./roll');
var character_class_1 = require('./character.class');
var data_service_1 = require('./data.service');
var constants_1 = require('./constants');
var CharacterService = (function () {
    function CharacterService(ds) {
        this.ds = ds;
    }
    /**
     * Get an random name for the character
     * @param  {string} race String key for the race
     * @param  {string} type Type of name to get: male, female, family
     * @return {string}      Random name
     */
    CharacterService.prototype.generateAttributesArray = function (rollNotation) {
        if (rollNotation === void 0) { rollNotation = '5d6k3'; }
        var attributes = [];
        for (var key in constants_1.ATTRIBUTES) {
            attributes.push(this.generateAttribute(key, rollNotation));
        }
        return attributes;
    };
    CharacterService.prototype.generateAttribute = function (key, rollNotation) {
        if (rollNotation === void 0) { rollNotation = '5d6k3'; }
        var attribute = new character_class_1.Attribute(key, roll_1.Roll.roll(rollNotation));
        return attribute;
    };
    CharacterService.prototype.generateName = function (race, type) {
        race = race.toLowerCase();
        var raceObj = mock_names_1.NAMES[race];
        if (!raceObj)
            throw "invalid race (" + race + ")";
        var names;
        if (type) {
            type = type.toLowerCase();
            names = raceObj[type];
            if (!names)
                throw "invalid name type (" + type + ")";
        }
        else {
            names = raceObj.male.concat(raceObj.female);
        }
        var idx = Math.floor(Math.random() * names.length);
        var name = names[idx];
        return name;
    };
    /**
     * Generate character hit points based on class and level
     * @param  {string} characterClassName "name" property from character class"
     * @param  {number} characterLevel     Level
     * @return {number}                    Randomized hit point value
     */
    CharacterService.prototype.generateHitPoints = function (characterClassName, characterLevel) {
        var characterClass = this.ds.getClass(characterClassName);
        var sides = 6;
        if (!characterClass) {
            console.log("invalid character class name (" + characterClassName + "). Defaulting to d6");
            sides = 6;
        }
        else {
            sides = characterClass.hitDieSides;
        }
        if (!characterLevel || characterLevel < 1) {
            console.log("invalid character level (" + characterLevel + ").  Defaulting to 1");
            characterLevel = 1;
        }
        var rollNotation = characterLevel + "d" + sides;
        return roll_1.Roll.roll(rollNotation);
    };
    CharacterService.prototype.getAbilityModifications = function (attributeName) {
        return [];
    };
    /**
     * Get a copy of the attributes array, adjusted for race modifiers
     * @param  {Attribute[]} attributes Raw attributes
     * @param  {string}      raceName   Name of the race
     * @return {Attribute[]}            Attribute array, adjusted with race modifiers
     **/
    CharacterService.prototype.getAdjustedAttributes = function (attributes, raceName) {
        var race = raceName ? this.ds.getRace(raceName) : null;
        if (!race && raceName)
            throw "Invalid race name (" + raceName + ")";
        var adjustedAttributes = [];
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var effects = race.attributeEffects[attributes[i].key];
            adjustedAttributes.push(new character_class_1.Attribute(attribute.key, attribute.value + effects.modValue));
        }
        return adjustedAttributes;
    };
    CharacterService.prototype.getAttributeRaceMod = function (attributeKey, raceName) {
        var race = this.ds.getRace(raceName);
        if (!race)
            throw "Invalid Race Name (" + raceName + ")";
        var attributeEffect = race.attributeEffects[attributeKey];
        if (!attributeEffect)
            throw "Attribute key not found (" + attributeKey + ")";
        return attributeEffect.modValue;
    };
    CharacterService.prototype.getRace = function (raceName) {
        return this.ds.getRace(raceName);
    };
    CharacterService.prototype.getRaces = function () {
        return this.ds.getRaces();
    };
    CharacterService.prototype.getClass = function (className) {
        return this.ds.getClass(className);
    };
    CharacterService.prototype.getClasses = function () {
        return this.ds.getClasses();
    };
    // getSavingThrow(savingThrowName: string, className: string, level: number = 1, raceName: string = 'human', attributes?: Attribute[]) {
    // 	let savingThrow = ds.getSavingThrow(className, savingThrowName);
    //
    // }
    CharacterService.prototype.getSavingThrowDetailObject = function (savingThrowName, className, level, raceName, attributes) {
        var stdObj = new character_class_1.SavingThrowDetail();
        stdObj.savingThrowName = savingThrowName;
        stdObj.rollTarget = this.ds.getSavingThrow(savingThrowName, className, level);
        stdObj.raceMod = this.ds.getSavingThrowRaceMod(savingThrowName, raceName);
        stdObj.attributeMod = this.ds.getSavingThrowAttributeMod(savingThrowName, attributes);
        stdObj.classMod = this.ds.getSavingThrowClassMod(savingThrowName, className);
        return stdObj;
    };
    CharacterService.prototype.getSavingThrowList = function (className, level, raceName, attributes) {
        if (level === void 0) { level = 1; }
        if (raceName === void 0) { raceName = 'human'; }
        var savingThrowList = [];
        var savingThrowNames = this.ds.getSavingThrowNames();
        for (var i = 0; i < savingThrowNames.length; i++) {
            var name_1 = savingThrowNames[i];
            var stdObj = this.getSavingThrowDetailObject(name_1, className, level, raceName, attributes);
            savingThrowList.push(stdObj);
        }
        return savingThrowList;
    };
    CharacterService.prototype.getValidity = function (attributes, className, raceName) {
        var charClass = className ? this.ds.getClass(className) : null;
        if (!charClass && className)
            throw "Invalid class name (" + className + ")";
        var race = raceName ? this.ds.getRace(raceName) : null;
        if (!race && raceName)
            throw "Invalid race name (" + raceName + ")";
        var adjustedAttributes = [];
        if (attributes)
            adjustedAttributes = (!raceName) ? attributes : this.getAdjustedAttributes(attributes, raceName);
        var validity = {
            race: race,
            charClass: charClass,
            adjustedAttributes: adjustedAttributes,
            meetsRaceRequirements: true,
            meetsClassRequirements: true,
            xpAdjustment: 0
        };
        if (raceName) {
            validity.meetsRaceRequirements = this.meetsRaceRequirements(adjustedAttributes, raceName);
        }
        ;
        if (className) {
            validity.meetsClassRequirements = this.meetsClassRequirements(adjustedAttributes, className),
                validity.xpAdjustment = this.getXpAdjustment(adjustedAttributes, className);
        }
        return validity;
    };
    CharacterService.prototype.getXpAdjustment = function (attributes, className) {
        var characterClass = this.ds.getClass(className);
        if (!characterClass)
            throw "Invalid class name " + className;
        var requisites = characterClass.primeRequisites;
        if (requisites.length < 1)
            return 0;
        var requisiteTotal = 0, requisiteCount = 0;
        for (var i = 0; i < attributes.length; i++) {
            var key = attributes[i].key;
            var value = attributes[i].value;
            for (var j = 0; j < requisites; j++) {
                if (requisites[j] == key) {
                    requisiteTotal += value;
                    requisiteCount += 1;
                }
            }
        }
        var avg = Math.ceil(requisiteTotal / requisiteCount);
        var xpAdjustment = constants_1.XP_ADJUSTMENTS[avg];
        return xpAdjustment;
    };
    CharacterService.prototype.meetsClassRequirements = function (attributes, className) {
        var characterClass = this.ds.getClass(className);
        if (!characterClass)
            throw "Invalid class name (" + className + ")";
        var requirements = characterClass.attributeRequirements;
        attributes = attributes || [];
        var hasRequirements = true;
        for (var i = 0; i < attributes.length; i++) {
            var key = attributes[i].key;
            var value = attributes[i].value;
            if (requirements[key] && value < requirements[key]) {
                hasRequirements = false;
                break;
            }
        }
        return hasRequirements;
    };
    CharacterService.prototype.meetsRaceRequirements = function (attributes, raceName) {
        var race = raceName ? this.ds.getRace(raceName) : null;
        if (!race && raceName)
            throw "Invalid race name (" + raceName + ")";
        var requirements = race.attributeEffects;
        attributes = attributes || [];
        var hasRequirements = true;
        for (var i = 0; i < attributes.length; i++) {
            var key = attributes[i].key;
            var value = attributes[i].value;
            var requirement = requirements[key];
            if (requirement &&
                (value < requirement.minValue || value > requirement.maxValue ||
                    (requirement.required && requirement.required > value))) {
                hasRequirements = false;
                break;
            }
        }
        return hasRequirements;
    };
    CharacterService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(data_service_1.DataService)), 
        __metadata('design:paramtypes', [data_service_1.DataService])
    ], CharacterService);
    return CharacterService;
}());
exports.CharacterService = CharacterService;
//# sourceMappingURL=character.service.js.map