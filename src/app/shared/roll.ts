export class Roll {
	public diceCount: number = 1;
	public diceSides: number = 20;
	public keepCount?: number;
 	public modifier:number = 0;
	public rawRolls: number[];
	public rollValue: number;
	public lastRollDate: Date;

	constructor(public rollNotation?: string) {
		if (!rollNotation) return this;
		let roll: Roll = this.parseRollNotation(this.rollNotation);
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
	public rollMe(): number {
		return this.calcRoll(this.diceCount,this.diceSides,this.keepCount,this.modifier);
	}

/**
 * Calculate the roll value based on the passed parameters; also updates this.rollValue
 * and this.lastRollDate
 * @param  {number} diceCount=1 Number of dice to roll
 * @param  {number} diceSides=6 Number of the sides on the diceSides
 * @param  {number} keepCount   Number of top values of the rolled dice to keepCount
 * @param  {number} modifier=0  +/- modifier to add to the rolled and kept dice total
 * @return {number}             Value to return
 */
	public calcRoll(diceCount= 1, // number of dice to roll
			diceSides = 6, // number of sides on each die
			keepCount?: number, // keep the value of the top keepCount dice
			modifier = 0) : number {

	  this.rawRolls = [];

		// Generate a random value for each die
	  for (let i = 1; i <= diceCount; i++) {
	    let roll = Math.ceil(Math.random() * diceSides);
	    this.rawRolls.push(roll);
	  }

		// keep only the top keepCount dice
		let rolls = this.rawRolls.slice();
	  if (keepCount) {
	    rolls.sort();
	    rolls = rolls.slice(diceCount - keepCount);
	  }

		// aggregate the total of the remaining dice
	  let rollTotal =  rolls.reduce(function(total: number, r: number) {
	    return total += r;
	  },0);

		// save roll value
		this.rollValue = rollTotal + modifier;
		this.lastRollDate = new Date();

		// return total
	  return this.rollValue;
	}

/**
 * [parseRollNotation description]
 * @param  {string} rollNotation [description]
 * @param  {Roll}   roll         [description]
 * @return {Roll}                [description]
 */
	public parseRollNotation(rollNotation: string, roll?: Roll): Roll {
		// 1d6, 4d20+5, 5d6k3, 7d10k5-3 are valid notation objects
		let validNotation = /^(\d+d\d+k\d+[\-\+]\d+|\d+d\d+|\d+d\d+[k\-\+]\d+)$/i;

		if (!validNotation.test(rollNotation)) {
			throw `${rollNotation} is in an invalid RollNotation format`;
		}
		let diceCount: number = parseInt(rollNotation.match(/^(\d*)/)[1]);
		let diceSides: number = parseInt(rollNotation.match(/^\d*d(\d*)/)[1]);

		let keepMatches: string[] = rollNotation.match(/^\d*d\d*k(\d*)/);
		let keepCount: number = keepMatches ? parseInt(keepMatches[1]) : null;

		let modMatch: string[] = rollNotation.match(/[\+\-](\d*)$/);
		let modifier: number = modMatch ? parseInt(modMatch[1]) : 0;

		if (!roll)	roll = new Roll();
		roll.diceCount = diceCount;
		roll.diceSides = diceSides;
		roll.keepCount = keepCount;
		roll.modifier= modifier;
		return roll;
	}

/**
 * Roll the dice based on the rollNotation param
 * @param  {string} rollNotation Roll in rollNotation format ('5d6k3+2')
 * @return {number}              value of the roll
 */
	static roll(rollNotation: string) : number {
		let roll = new Roll(rollNotation);
		return roll.rollMe();
	}

	/**
	 * [getRoll description]
	 * @param  {string} rollNotation [description]
	 * @return {Roll}                [description]
	 */
	static getRoll(rollNotation: string): Roll {
		let roll = new Roll(rollNotation);
		roll.rollMe();
		return roll
	}
}
