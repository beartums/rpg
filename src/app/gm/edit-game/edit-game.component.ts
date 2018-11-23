import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { GmDataService } from '../gm-data.service';

import { Game, GameOptions } from '../../game.class';
import { Character } from '../../character.class';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.css']
})
export class EditGameComponent implements OnInit {

	game$: Observable<Game>;
	characters$;
	key: string;
	game = {
		edited: null,
		original: null
	}

  constructor(private route: ActivatedRoute,
							private gmds: GmDataService,
							private router:Router) { }

  ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.key = params.get('key');
			this.game$ = this.gmds.fetchGame$(this.key);
			this.game$.subscribe((game: Game) => {
				this.resetGame(game);
				this.characters$ = this.gmds.fetchCharactersAndPlayers$(game);
			});
		});
  }

	saveChanges(gameChanges, game) {
		Object.assign(game,gameChanges);
		this.gmds.updateGame(this.key,game);
		this.game = {
			edited: null,
			original: null
		};
		this.router.navigate(['manage-games']);
	}
	cancelChanges() {
		this.game = {
			edited: null,
			original: null
		};
		this.router.navigate(['manage-games']);
	}
	resetGame(game?: Game) {
		if (game) this.game.original = game;
		this.game.edited = Object.assign({},this.game.original);
	}


}
