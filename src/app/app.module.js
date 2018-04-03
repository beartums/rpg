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
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
var character_creation_component_1 = require('./character-creation.component');
var saving_throw_chart_component_1 = require('./saving-throw-chart.component');
var race_info_component_1 = require('./race-info.component');
var class_info_component_1 = require('./class-info.component');
var select_by_label_component_1 = require('./shared/select-by-label.component');
var modifier_pipe_1 = require('./shared/modifier.pipe');
var case_convert_pipe_1 = require('./shared/case-convert.pipe');
var object_as_values_pipe_1 = require('./shared/object-as-values.pipe');
var ng_bootstrap_1 = require('@ng-bootstrap/ng-bootstrap');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule, ng_bootstrap_1.NgbModule.forRoot()],
            declarations: [app_component_1.AppComponent, character_creation_component_1.CharacterCreationComponent, saving_throw_chart_component_1.SavingThrowChartComponent, select_by_label_component_1.SelectByLabelComponent, race_info_component_1.RaceInfoComponent, class_info_component_1.ClassInfoComponent, modifier_pipe_1.ModifierPipe, case_convert_pipe_1.CaseConvertPipe, object_as_values_pipe_1.ObjectAsValuesPipe],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map