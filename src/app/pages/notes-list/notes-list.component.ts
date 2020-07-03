import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NotesService} from '../../shared/notes.service';
import {Note} from '../../shared/note.module';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations : [
    trigger('itemAnim', [
      // ENTRY ANIMATION
      transition('void => *', [
        // Set the initial state
        style({
          height : 0,
          opacity : 0,
          transform : 'scale(0.85)',
          'margin-bottom' : 0,

          // we have to expand out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }),
        // we first want to animate the spacing (which includes heights and margin)
        animate('50ms', style({
          height: '*',
          'margin-bottom' : '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*',
        })),
        animate(100)
      ]),

      transition('* => void', [
        // we want to scale up
        animate(50, style({
          transform : 'scale(1.05)',
        })),
        // then scale down back to normal size
        animate(50, style({
          transform : 'scale(1)',
          opacity : 0.75
        })),
        // scale down while begining to fade out
        animate('120ms ease-out', style({
          transform : 'scale(0.68)',
          opacity : 0
        })),
        // then animate the spacing
        animate('150ms ease-out', style({
          height : 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          'margin-bottom' : '0'
        }))

      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity : 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease' )
          ])
        ], {
          optional : true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>;

  constructor(private noteService: NotesService) { }

  ngOnInit(): void {
    // we want to get all notes from the service
    this.notes = this.noteService.getAll();
    this.filteredNotes = this.noteService.getAll();
  }

  deleteNote(note: Note): void {
    let noteId = this.noteService.getId(note);
    this.noteService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteURL(note: Note): number{
    return this.noteService.getId(note);
  }

  filter(query: string): void {
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
      // split up the search qury into individual worlds
    let terms = query.split(' ');
    // remouve duplicates
    terms = this.removeDuplicates(terms);
    // compile all relevant results into allResults array
    terms.forEach( term => {
      let results: Note[] = this.relevantNotes(term);
      // append result to the allResult array => deconstruction
      allResults = [...allResults, ...results];
    });

    // allResults will include duplicate notes
    // because a note can be the result of many search terms
    // but we don't want the same note multiple times
    // so we first must remove the duplicates
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    // now sort by relevancy a
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>): Array<any>{
    let uniqueResults: Set<any> = new Set<any>();
    // loop throug the array and add the items to the set
    arr.forEach(e => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note>{
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (note.body?.toLowerCase().includes(query) || note.title?.toLowerCase().includes(query)){
        return true;
      }else{
        return false;
      }
    });

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]){
    // will calculate the relevancy of a note based on the number of time it appears in the search results
    let noteCountObj: object = {}; // format - key:value => noteId:number (note object : count)
    searchResults.forEach(note => {
      let noteId = this.noteService.getId(note); // get the note id
      if (noteCountObj[noteId]){
        noteCountObj[noteId] += 1;
      }else{
        noteCountObj[noteId] = 1;
      }
    });

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aid = this.noteService.getId(a);
      let bid = this.noteService.getId(b);

      let aCount = noteCountObj[aid];
      let bCount = noteCountObj[bid];

      return bCount - aCount;
    });

  }
}
