import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Note} from '../../shared/note.module';
import {NotesService} from '../../shared/notes.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  note : Note;
  noteId: number;
  new : boolean;

  constructor(private noteService: NotesService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // we want to find out if we are creating a new note or editing an existing one
    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if(params.id){
        this.note = this.noteService.get(params.id);
        this.noteId = params.id;
        this.new = false;
      }else{
        this.new = true;
      }
    });
    //
  }

  onSubmit(form: NgForm): void{
    if(this.new){ // Save the note
      this.noteService.add(form.value);
    }else{ // update the note
      this.noteService.update(this.noteId, form.value.title, form.value.body );
    }
    this.router.navigateByUrl('/');
  }
}
