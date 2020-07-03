import { Injectable } from '@angular/core';
import {Note} from './note.module';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();
  constructor() { }

  getAll(): Note[]{
    return this.notes;
  }

  get(id: number): Note{
    return this.notes[id];
  }

  getId(note: Note) : number{
    return this.notes.indexOf(note);
  }

  add(note) : number{
    // add a note to the array and return an Id
    // where the id = index
    let newLength = this.notes.push(note);
    let index = newLength - 1;
    return index;
  }

  update(id: number, title: string, body: string): void{
    let note = this.notes[id];
    note.title = title;
    note.body= body;
  }

  delete(id: number): void{
    this.notes.splice(id, 1);
  }
}
