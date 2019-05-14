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
	private _isLoggedIn = false;
	private _isGm = false;
	private _isLoggedIn$: Observable<boolean>;
	private _isGm$: Observable<boolean>;

	get isLoggedIn(): boolean {	return this._isLoggedIn; }
	get isGm(): boolean {	return this._isGm; }
	get isLoggedIn$(): Observable<boolean> {	return this._isLoggedIn$; }
	get isGm$(): Observable<boolean> {	return this._isGm$; }
	get userEmail(): string { return this.userData.email }
	get userDisplayName(): string { return this.userData.displayName; }
	get userId(): string { return this.userData.uid }

  constructor(private firebaseAuth: AngularFireAuth, router: Router) {

    // Wanted to do some offline programming at the hairy lemon, so tried to override the user info
    // here.  Never got this working properly (partly because there was a lot to do at the hairy lemon)
    this.user = !environment.offline ? firebaseAuth.authState : of(this._offlineUser);

    // Set private observables -- used mostly by AuthGuards
		this._isGm$ = this.user.map(user => this.isUserGm(user));
    this._isLoggedIn$ = this.user.map(user => user ? true : false);

    // Subscribe to the user observable to handle login state changes and set private
    // non-observable state properties
		this.user.subscribe(user => {
			this.userData = user;
			if (user) {
        // Set loggedin and GM status
				this._isLoggedIn = true;
				this._isGm = this.isUserGm(user);
			} else {
        // Set logged out and GM status.  Also clear out the userdata
				this._isLoggedIn = false;
        this._isGm = false;
        this.userData = null;
			}
		});
  }

  /**
   * Test is the user is a Game master
   * @param user Currently logged in user
   * @returns True if user is a gm
   */
	isUserGm(user: firebase.User): boolean {
    return user.email.substr(0, 4)
      .toLowerCase() === 'eric';
	}

  /**
   * Sign up with email and password (not used)
   * @param email Email of person signing up
   * @param password Password of same person
   */
  signupWithEmail(email: string, password: string) {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  /**
   * Login using email and password (Unused)
   * @param email Email of logger inner
   * @param password password of logger inner
   */
  loginWithEmail(email: string, password: string) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  /**
   * Google OAuth login
   */
  loginWithGoogle() {
    this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then(value => {
        console.log(value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  /**
   * Just what it says.  Log Out.
   */
  logout() {
    this.firebaseAuth.auth.signOut();
  }

}
