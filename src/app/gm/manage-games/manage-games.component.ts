import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GmDataService } from '../gm-data.service';

import { Game, GameOptions } from '../../game.class';

@Component({
  selector: 'manage-games',
  templateUrl: './manage-games.component.html',
  styleUrls: ['./manage-games.component.css'],

})
export class ManageGamesComponent implements OnInit {

	game = {
		edited: null,
		original: null
		};
	characters$;

  constructor(private gmds: GmDataService, private router:Router) { }

  ngOnInit() {
  }

	newGame() {
		let game: Game = new Game();
		game.description ='New Game';
		game.name = 'New game';
		//game.userId = this.authService.userId;
		this.gmds.addGame(game);
	}

	editGame(game) {
		this.router.navigate(['edit-game',game.key]);
	}

	deleteGame(key) {
		this.gmds.deleteGame(key);
	}

	runGame(game) {
			this.router.navigate(['run-game',game.key]);
	}

}
