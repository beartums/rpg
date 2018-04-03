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
var forms_1 = require('@angular/forms');
var character_service_1 = require('./character.service');
var data_service_1 = require('./data.service');
var core_2 = require('@angular/core');
var CharacterCreationComponent = (function () {
    function CharacterCreationComponent(cs, ds, fb) {
        this.cs = cs;
        this.ds = ds;
        this.fb = fb;
        this.DETAIL_CONTROLS = ['characterName', "nickname"];
        this.level = 1;
        this.detailsLocked = false;
        this.attributesLocked = false;
        this.createForm();
    }
    CharacterCreationComponent.prototype.createForm = function () {
        this.characterForm = this.fb.group({
            characterName: { value: '', disabled: true },
            //			gender: {value:'',disabled:true},
            nickname: { value: "", disabled: true }
        });
        //this.toggleDetailControls();
    };
    CharacterCreationComponent.prototype.generateAttributes = function () {
        this.characterAttributes = this.cs.generateAttributesArray();
        this.selectedIndex = null;
    };
    CharacterCreationComponent.prototype.generateName = function (raceName, gender) {
        raceName = raceName || this.characterRace;
        gender = gender || this.characterGender;
        gender = (gender !== 'Male' && gender !== 'Female') ? null : gender;
        var fName = this.cs.generateName(raceName, gender);
        var lName = this.cs.generateName(raceName, 'family');
        this.characterForm.patchValue({ 'characterName': fName + ' ' + lName });
    };
    CharacterCreationComponent.prototype.getAdjustedAttributes = function () {
        if (!this.characterAttributes || this.characterAttributes.length < 1)
            return [];
        if (!this.characterRace)
            return [];
        return this.cs.getAdjustedAttributes(this.characterAttributes, this.characterRace);
    };
    CharacterCreationComponent.prototype.getAttributeRaceMod = function (attributeKey, raceName) {
        return this.cs.getAttributeRaceMod(attributeKey, raceName);
    };
    CharacterCreationComponent.prototype.getClassValidity = function (className, raceName) {
        if (!this.characterAttributes)
            return [];
        raceName = raceName || this.characterRace || "";
        raceName = raceName.length == 0 ? null : raceName;
        var validity = this.cs
            .getValidity(this.characterAttributes, className, raceName);
        return validity.meetsClassRequirements;
    };
    CharacterCreationComponent.prototype.getRaceValidity = function (raceName, className) {
        if (!this.characterAttributes)
            return [];
        className = className || this.characterClass || "";
        className = className.length == 0 ? null : className;
        var validity = this.cs
            .getValidity(this.characterAttributes, className, raceName);
        return validity.meetsRaceRequirements;
    };
    CharacterCreationComponent.prototype.getValidClasses = function () {
        var classes = this.ds.getClasses();
        var validClasses = [];
        for (var i = 0; i < classes.length; i++) {
            if (this.getClassValidity(classes[i].name, null)) {
                validClasses.push(classes[i]);
            }
        }
        return validClasses;
    };
    CharacterCreationComponent.prototype.getValidRaces = function () {
        var races = this.ds.getRaces();
        var validRaces = [];
        for (var i = 0; i < races.length; i++) {
            if (this.getRaceValidity(races[i].name, null)) {
                validRaces.push(races[i]);
            }
        }
        return validRaces;
    };
    CharacterCreationComponent.prototype.
    /**
     * Listen for keyboard shortcuts
     * @param  {any}    event Keyboard event object
     * @return {[type]}       [description]
     */
    keyboardInput = function (event) {
        // if nothing is selected, or the pressed key is not one we are capturing
        // just return.
        if (!this.selectedIndex && this.selectedIndex !== 0)
            return;
        if (event.key != "ArrowDown" && event.key != "ArrowUp" && event.key != "Escape")
            return;
        // prevent any other DOM element from capturing
        event.preventDefault();
        // Unselect all attributes on Escape
        if (event.key == "Escape") {
            this.selectedIndex = null;
            return;
        }
        // keydown moves the attribute value to the next attribute,
        // keyup moves it to the previous attribute
        var a = this.characterAttributes[this.selectedIndex];
        var newIndex;
        if (event.key == "ArrowDown") {
            if (this.selectedIndex >= this.characterAttributes.length - 1)
                return;
            newIndex = this.selectedIndex + 1;
        }
        else if (event.key == "ArrowUp") {
            if (this.selectedIndex < 1)
                return;
            newIndex = this.selectedIndex - 1;
        }
        // swap values
        var b = this.characterAttributes[newIndex];
        var c = a.value;
        a.value = b.value;
        b.value = c;
        // move selection to the attribute that got the moving value
        this.selectedIndex = newIndex;
    };
    CharacterCreationComponent.prototype.toggleControlsEnabled = function (controls) {
        controls = controls || this.DETAIL_CONTROLS;
        var ctrl;
        var form = this.characterForm;
        var wasEnabled;
        controls.forEach(function (control) {
            ctrl = form.get(control);
            wasEnabled = ctrl.enabled;
            ctrl.enabled ? ctrl.disable() : ctrl.enable();
        });
        return wasEnabled;
    };
    CharacterCreationComponent.prototype.toggleAttributeLock = function () {
        if (this.detailsLocked)
            return;
        this.selectedIndex = null;
        this.attributesLocked = !this.attributesLocked;
        var wasEnabled = this.toggleControlsEnabled(this.DETAIL_CONTROLS);
        if (wasEnabled)
            this.clearControls(this.DETAIL_CONTROLS);
    };
    CharacterCreationComponent.prototype.toggleDetail = function (detailName, detailValue, isEnabled) {
        if (!isEnabled)
            return;
        var property = 'character' + detailName;
        this[property] = this[property] == detailValue ? null : detailValue;
    };
    CharacterCreationComponent.prototype.clearControls = function (controls) {
        controls = controls || this.DETAIL_CONTROLS;
        var patchObj = {};
        controls.forEach(function (control) {
            patchObj[control] = "";
        });
        this.characterForm.patchValue(patchObj);
        this.characterRace = "";
        this.characterClass = "";
        this.characterGender = "";
        this.characterGood = "";
        this.characterLaw = "";
    };
    CharacterCreationComponent.prototype.selectIndex = function (idx) {
        if (this.attributesLocked)
            return;
        if (this.selectedIndex == idx)
            this.selectedIndex = null;
        else
            this.selectedIndex = idx;
    };
    __decorate([
        core_2.HostListener('window:keydown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], CharacterCreationComponent.prototype, "keyboardInput", null);
    CharacterCreationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'character-creation',
            templateUrl: './character-creation.component.html',
            styleUrls: ['./character-creation.component.css'],
            providers: [character_service_1.CharacterService, data_service_1.DataService],
        }), 
        __metadata('design:paramtypes', [character_service_1.CharacterService, data_service_1.DataService, forms_1.FormBuilder])
    ], CharacterCreationComponent);
    return CharacterCreationComponent;
}());
exports.CharacterCreationComponent = CharacterCreationComponent;
//# sourceMappingURL=character-creation.component.js.map