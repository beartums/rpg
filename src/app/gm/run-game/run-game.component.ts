import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { GmDataService } from '../gm-data.service';
import { CharacterService } from '../../character.service';

import { Game, GameOptions, Note } from '../../game.class';
import { Character, STAGE, GAME_STATUS } from '../../character.class';
import { Monster } from '../../monster.class';

/**
 * Enum for the character equipment mode
 *
 * @enum {number}
 */
enum EqMode { buying= 'cart', selling = 'character'};

/**
  * @ngdoc component
  * @name gm_module.component:runGame
  *
  * @description
  * GM Primary interactive page, showing the characrter stats and giving access
  * to primary tools
  *
*/
@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.css','../../app-styles.css'],
	providers: [CharacterService]
})
export class RunGameComponent implements OnInit {

 	game$: Observable<Game>;
	game: Game;
	characters$: Observable<Character[]>; // characters currently in the game
  players: Observable<any>[] = [];      // players whose characters are playing

  // for unsubscribing
	subscriptions: any[] = [];

  // Observable of characters who exist (in the db) who might be added
	existingCharacters$: Observable<Character[]>;
	existingCharacterId: string;
	addingExistingCharacter: boolean; // Display existing character selections

	key: string;        // current game key
	selectedCharacter: Character;  // selected character for character display
	timeoutId;          // for hacked debounce when making lots of changes quickly

  // for view support
  GAME_STATUS = GAME_STATUS       // Constant for reference
  /**
   * Display AC using armor if true, otherwise show unarmored AC
   * @type {boolean}
   * @memberOf RunGameComponent
   */
  showArmoredAc: boolean = false;
  /**
   * Name/key of the tab to display at the bottom part of the page
   * @type {string}
   * @memberOf RunGameComponent
   */
  tab: string;                    // which tab to show in the bottom panel
  /**
   * Name/Key of the tab to show within the tab showing at the bottom
   * @type {string}
   * @memberOf RunGameComponent
   */
  subtab: string;                 // Which subtab to show in the visible tab
  equipmentMode: EqMode;          // buying or selling?
  monster: Monster;               // selected monster to display in monster tab
  selectedCharacterKey: string;

  /**
   * @constructor
   * @param route Route for extracting parameters
   * @param gmds GM Data Service
   * @param cs Character Service
   * @param router Router for navigation
   */
  constructor(private route: ActivatedRoute,
							public gmds: GmDataService,
							private cs: CharacterService,
							private router: Router ) { }

  /**
   * Initialization
   */
  ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.key = params.get('key');
			this.game$ = this.gmds.fetchGame$(this.key);
			this.characters$ = this.gmds.fetchCharactersByGameId$(this.key);
			let subscription = this.game$.subscribe((game: Game) => {
				this.game = game;
			});
			this.subscriptions.push(subscription);
		});
	}

	/**
   * unsubscribe
   * @memberOf RunGameComponent
   */
  ngOnDestroy() {
		this.subscriptions.forEach(subscription=> { subscription.unsubscribe() });
  }

  @HostListener('window:keydown', ['$event'])
    // when there is a selected character, numpad + and numpad -
    // affect the character's HP total
		keyboardInput(event: any) {
			if (!this.selectedCharacter) return;

      if (event.code!="NumpadSubtract" && event.code!="NumpadAdd") return;


      let isChanged: boolean = false;
			if (event.code=="NumpadSubtract") {
				isChanged = this.adjustHitPoints(this.selectedCharacter,-1);
			} else if (event.code=="NumpadAdd") {
				isChanged = this.adjustHitPoints(this.selectedCharacter,1);
      }

      // HACK: Debounce. If .5 seconds haven't elapsed since the last
      //  HP adjustment request, then cancle the previous update and
      //  use this one (tempHP is being updated, so the result is cumulative)
      if (isChanged) {
        // clear the previous timeout so that update doesn't happen
			  if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout( (_this, _key, _character) => {
          _this.gmds.updateCharacter(_key,_character);
        }, 500, this, this.selectedCharacter.key, this.selectedCharacter);
      }
			return;
		}

  /**
   * Add or subtract hit points from character total
   * @param {Character} character Character being updated
   * @param {number} adjustment Adjustment to Temporary Hit Point Total
   * @returns {boolean} True if any value in the character has changed
   *
   * @memberOf RunGameComponent
   */
  adjustHitPoints(character: Character, adjustment: number): boolean {
		let thp = character.temporaryHitPoints;
		if (adjustment==0) return false;

    // if subtracting hitpoints
		if (adjustment < 0) {
      // make sure temp hit points are defined
			if (!thp && thp!==0) {
				character.temporaryHitPoints = +character.hitPoints;
			}
		// if adding hit points
		} else if (adjustment > 0) {
      // ...and temp hitpoints are undefined, then already at max and can't add
			if (!thp && thp !== 0) return false;
		}

    // adjust.
    character.temporaryHitPoints += adjustment;
    //if greater than allowed, set to allowed
		if (character.temporaryHitPoints >= character.hitPoints) {
			character.temporaryHitPoints = null;
    }
    return true; // changes were made

	}

  /**
   * Change the status of the game.  But, really, just update the saved game to
   * match whatever changes have been made
   *
   * @param {Game} game Game for which to save updates
   *
   * @memberOf RunGameComponent
   */
  changeGameStatus(game: Game) {
		this.gmds.updateGame(this.key,game);
	}

	/**
   * Clear the current character selection
   *
   * @memberOf RunGameComponent
   */
  clearSelected() {
		this.selectedCharacter = null;
	}

  /**
   * Send a character to the crusher and lose it forever
   *
   * @param {Character} character Character to assign to the pits of hell
   *
   * @memberOf RunGameComponent
   */
  destroyCharacter(character: Character) {
		if (confirm("Do you want to obliterate " + character.name + " PERMANENTLY!?!?")) {
			this.gmds.deleteCharacter(character.key)
			let idx = this.game.characters.indexOf(character.key);
			this.game.characters.splice(idx,1);
			this.gmds.updateGame(this.key,this.game);
			this.clearSelected();
		}
  }

  /**
   * Eject the character from the game
   * @param character Character to kick from the game
   */
	ejectCharacter(character: Character) {

			let idx = this.game.characters.indexOf(character.key);
			this.game.characters.splice(idx,1);
			this.gmds.updateGame(this.key,this.game);
			character.currentGame = null;
			this.gmds.updateCharacter(character.key,character);
			this.clearSelected();
	}

  /**
   * Get all the existing characters that are not in a game to populate
   * a select box for adding one of them to the current game
   */
	addExistingCharacter() {
		this.clearSelected();
		this.addingExistingCharacter = true; // Display the existing characters
		this.existingCharacters$ = this.gmds.fetchCharactersByGameId$(null).take(1);
	}

  /**
   * Retrieve a number corresponding to the specified attribute in the list
   * @param attributeKey The key of the attribute to retrieve
   * @param attributes The attribute list to search
   */
  getAttributeValue(attributeKey,attributes): number {
		if (!attributes) return 0;
    return attributes
      .find(attribute => { return attribute.key == attributeKey }).value;
	}

  /**
   * Get the character armor class
   * @param character Character to return the armor class of
   * @param useArmor If true, return armored armor class, else unarmored
   */
	getAc(character: Character,useArmor: Boolean): number {
		if (!useArmor) return this.cs.getRawArmorClass(character);
		return this.cs.getArmoredArmorClass(character);
	}

  /**
   * Get the string representation of the character hit points for display.
   * this will be either HP or HP/TempHP
   * @param character Character for which to retrieve Hit Points
   */
  getHP(character:Character): string {
		let hp = "";
		if (character.temporaryHitPoints || character.temporaryHitPoints===0) {
			hp = character.temporaryHitPoints + '/';
		}
		hp += character.hitPoints;
		return hp;
	}

  /**
   * Get an array of string statuses from the GAME_STATUS enum to display in
   * the status dropdown
   */
	getStatuses() {
		let statuses = []
		let idx = 0;
		while (GAME_STATUS[idx]) {
			statuses.push(GAME_STATUS[idx++])
		}
		return statuses;
	}

  /**
   * Create a new character to be included in the game.  GM editable
   */
	newCharacter() {
		this.clearSelected();
		let character = new Character();
		character.attributes = this.cs.generateEmptyAttributesArray();
		character.currentGame = this.key;
		character.name = 'Nobody (yet)';
		let charRef = this.gmds.addCharacter(character);
		if (!this.game.characters) this.game.characters = [];
		this.game.characters.push(charRef.key);
		this.gmds.updateGame(this.key,this.game);
	}

  /**
   * Save the notes for the game
   * @param notes Array of Note objects
   * @param game Game the notes refer to
   */
	saveNotes(notes: Note[], game: Game) {
		game.notes = notes;
		this.gmds.updateGame(this.key,game);
	}

  /**
   * Add an existing character to ye olde hearty band of adventurers
   */
	selectExistingCharacter() {
		let id = this.existingCharacterId;
		if (!this.game.characters) this.game.characters = []
    this.game.characters.push(id);
    // make sure the data reflects this change
		this.gmds.updateGame(this.key,this.game);
    this.gmds.updateCharacter(id,{currentGame:this.key});
    // Reset existing character globals
		this.addingExistingCharacter=false;
		this.existingCharacterId = null;
	}

  /**
   * Toggle AC with/without armor
   */
	toggleAcType() {
		this.showArmoredAc = !this.showArmoredAc;
	}

  /**
   * Save the character changes
   * @param character Character to update
   */
  updateCharacter(character:Character) {
		this.gmds.updateCharacter(character.key,character);
	}

}
