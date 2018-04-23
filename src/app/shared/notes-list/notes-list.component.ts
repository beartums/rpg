import { Component, OnInit, Input, Output, OnChanges, OnDestroy,
					SimpleChanges, EventEmitter } from '@angular/core';
					
import * as _ from 'lodash';

import { Note } from '../../game.class';

@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css','../../app-styles.css']
})
export class NotesListComponent implements OnInit, OnDestroy, OnChanges {

	@Output() notesChange: EventEmitter<Note[]> = new EventEmitter();
	@Input() notes: Note[];
	
	@Input() isGm: boolean;
	
	@Output() selectedNoteChange: EventEmitter<Note> = new EventEmitter();
	@Input() selectedNote: Note;
	
	_notes: Note[]
	_note: Note;
	
	newNote: Note;
	
  constructor() { }

  ngOnInit() {
  }
	ngOnDestroy() {
	}
	ngOnChanges(changes: SimpleChanges) {
		for (let prop in changes) {
			if (prop == 'notes') {
				if (!_.isEqual(this.notes, this._notes)) {
					// Show error message
				} 
				
				// ASSUMING that we'll be doing some kind of editing here
				this._notes = _.cloneDeep(changes[prop].currentValue);

			}
		}
	}
	
	addNote() {
		let note = new Note();
		note.isEditableByPlayers = false;
		note.isVisibleToPlayers = true;
		note.date = new Date();
		note.datetime = new Date();
		note.text = ""
		this.newNote = note;
	}
	
	cancelAddNote() {
		this.newNote = null;
	}
	
	saveNote(note) {
		if (!this.notes) this.notes=[];
		this.notes.unshift(note);
		this.newNote = null;
		this.emitNotesChange();
	}
	
	deleteNote(ev,note) {
		ev.preventDefault();
		ev.stopPropagation();
		let idx = this.notes.indexOf(note);
		if (idx > -1) this.notes.splice(idx,1);
		this.emitNotesChange();
	}
	
	toggleSelected(note: Note) {
		if (this.selectedNote == note) return;
		else this.selectedNote = note;
		this._note = _.cloneDeep(note);
	}
	
	cancelChanges(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		this.selectedNote = null;
		this._note = null;
	}
	
	saveChanges(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		let idx = this.notes.indexOf(this.selectedNote);
		if (idx > -1) this.notes[idx] = _.cloneDeep(this._note);
		this.selectedNote = null;
		this._note = null;
		this.emitNotesChange();
	}
	
	emitNotesChange() {
		if (_.isEqual(this.notes, this._notes)) return;
		this.notesChange.emit(this.notes);
		this._notes = _.cloneDeep(this.notes);
	}
	
	toggleIsEditable(note:Note) {
		note.isEditableByPlayers = !note.isEditableByPlayers;
	}
	
	toggleIsVisible(note: Note) {
		note.isVisibleToPlayers = !note.isVisibleToPlayers;
	}

}
