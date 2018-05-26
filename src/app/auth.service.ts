import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class AuthService {
  public user: Observable<firebase.User|any>;
	
	_offlineUser = {
		displayName: 'offline player',
		email: 'ric+offline@griffithnet.com',
		phoneNumber: '+256 DontCallMe',
		uid: 'xb0gzTfBzjgQ7Fc8e2O5L2XtciH3',
		photoURL: 'no/photo/here.jpg'
	}
			
	userData: any;
	private _isLoggedIn: boolean = false;
	private _isGm: boolean = false;
	private _isLoggedIn$: Observable<boolean>;
	private _isGm$: Observable<boolean>;
	
	get isLoggedIn(): boolean {	return this._isLoggedIn; }
	get isGm(): boolean {	return this._isGm; }
	get isLoggedIn$(): Observable<boolean> {	return this._isLoggedIn$; }
	get isGm$(): Observable<boolean> {	return this._isGm$; }
	get userEmail(): string { return this.userData.email }
	get userDisplayName(): string { return this.userData.displayName; }
	get userId(): string { return this.userData.uid }
	//get user(): any { return this.userData; }

  constructor(private firebaseAuth: AngularFireAuth, router: Router) {

		this.user = !environment.offline ? firebaseAuth.authState : of(this._offlineUser);
		this._isGm$ = this.user.map(user=> { return this.isUserGm(user) });
		this._isLoggedIn$ = this.user.map(user=> { return user ? true : false });
		this.user.subscribe(user => {
			let isNew = !this.userData;
			this.userData = user;
			if (user) {
				this._isLoggedIn = true;
				this._isGm = this.isUserGm(user) ;
				//if (isNew) router.navigate(['character-creation']);
			} else {
				this._isLoggedIn = false;
				this._isGm = false;
			}
		});
  }

	isUserGm(user): boolean {
		return user.email.substr(0,4).toLowerCase() === 'eric';
	}
	
  signupWithEmail(email: string, password: string) {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }

  loginWithEmail(email: string, password: string) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }
  loginWithGoogle() {
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then(value => {
        console.log(value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }
  logout() {
    this.firebaseAuth.auth.signOut();
  }

}