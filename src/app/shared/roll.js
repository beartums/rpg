"use strict";
var Roll = (function () {
    function Roll(rollNotation) {
        this.rollNotation = rollNotation;
        this.diceCount = 1;
        this.diceSides = 20;
        this.modifier = 0;
        if (!rollNotation)
            return this;
        var roll = this.parseRollNotation(this.rollNotation);
        this.diceSides = roll.diceSides;
        this.keepCount = roll.keepCount;
        this.diceCount = roll.diceCount;
        this.modifier = roll.modifier;
        return this;
    }
    /**
     * generate a roll value from a defined roll
     * @return {number} roll value
     */
    Roll.prototype.rollMe = function () {
        return this.calcRoll(this.diceCount, this.diceSides, this.keepCount, this.modifier);
    };
    /**
     * Calculate the roll value based on the passed parameters; also updates this.rollValue
     * and this.lastRollDate
     * @param  {number} diceCount=1 Number of dice to roll
     * @param  {number} diceSides=6 Number of the sides on the diceSides
     * @param  {number} keepCount   Number of top values of the rolled dice to keepCount
     * @param  {number} modifier=0  +/- modifier to add to the rolled and kept dice total
     * @return {number}             Value to return
     */
    Roll.prototype.calcRoll = function (diceCount, // number of dice to roll
        diceSides, // number of sides on each die
        keepCount, // keep the value of the top keepCount dice
        modifier) {
        if (diceCount === void 0) { diceCount = 1; }
        if (diceSides === void 0) { diceSides = 6; }
        if (modifier === void 0) { modifier = 0; }
        this.rawRolls = [];
        // Generate a random value for each die
        for (var i = 1; i <= diceCount; i++) {
            var roll = Math.ceil(Math.random() * diceSides);
            this.rawRolls.push(roll);
        }
        // keep only the top keepCount dice
        var rolls = this.rawRolls.slice();
        if (keepCount) {
            rolls.sort();
            rolls = rolls.slice(diceCount - keepCount);
        }
        // aggregate the total of the remaining dice
        var rollTotal = rolls.reduce(function (total, r) {
            return total += r;
        }, 0);
        // save roll value
        this.rollValue = rollTotal + modifier;
        this.lastRollDate = new Date();
        // return total
        return this.rollValue;
    };
    /**
     * [parseRollNotation description]
     * @param  {string} rollNotation [description]
     * @param  {Roll}   roll         [description]
     * @return {Roll}                [description]
     */
    Roll.prototype.parseRollNotation = function (rollNotation, roll) {
        // 1d6, 4d20+5, 5d6k3, 7d10k5-3 are valid notation objects
        var validNotation = /^(\d+d\d+k\d+[\-\+]\d+|\d+d\d+|\d+d\d+[k\-\+]\d+)$/i;
        if (!validNotation.test(rollNotation)) {
            throw rollNotation + " is in an invalid RollNotation format";
        }
        var diceCount = parseInt(rollNotation.match(/^(\d*)/)[1]);
        var diceSides = parseInt(rollNotation.match(/^\d*d(\d*)/)[1]);
        var keepMatches = rollNotation.match(/^\d*d\d*k(\d*)/);
        var keepCount = keepMatches ? parseInt(keepMatches[1]) : null;
        var modMatch = rollNotation.match(/[\+\-](\d*)$]/);
        var modifier = modMatch ? parseInt(modMatch[1]) : 0;
        if (!roll)
            roll = new Roll();
        roll.diceCount = diceCount;
        roll.diceSides = diceSides;
        roll.keepCount = keepCount;
        roll.modifier = modifier;
        return roll;
    };
    /**
     * Roll the dice based on the rollNotation param
     * @param  {string} rollNotation Roll in rollNotation format ('5d6k3+2')
     * @return {number}              value of the roll
     */
    Roll.roll = function (rollNotation) {
        var roll = new Roll(rollNotation);
        return roll.rollMe();
    };
    /**
     * [getRoll description]
     * @param  {string} rollNotation [description]
     * @return {Roll}                [description]
     */
    Roll.getRoll = function (rollNotation) {
        var roll = new Roll(rollNotation);
        roll.rollMe();
        return roll;
    };
    return Roll;
}());
exports.Roll = Roll;
//# sourceMappingURL=roll.js.map