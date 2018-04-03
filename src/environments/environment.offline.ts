// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
	offline: true,
	firebase: {
    apiKey: 'AIzaSyDg2dGQhVHUenvHh4ZqGyVCW1AU_5z7f4Q',
    //authDomain: 'rpg-helper-fbd5d.firebaseapp.com',
    //databaseURL: 'https://rpg-helper-fbd5d.firebaseio.com',
    databaseURL: 'ws://localhost.firebaseio.test:5000',
    projectId: 'rpg-helper-fbd5d',
    storageBucket: 'rpg-helper-fbd5d.appspot.com',
    messagingSenderId: '872569874462'
  }
};
