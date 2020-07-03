import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit , AfterViewInit{

  @Input() title: string;
  @Input() body: string;
  @Input() link: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator', {static: false}) truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText', {static: false}) bodyText: ElementRef<HTMLElement>;


  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void{
    // work out if there is a text overflow, and if not, then hide the truncator
    const style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHeight = parseInt(style.getPropertyValue('height'), 10);
    viewableHeight = viewableHeight + 10;
    if (this.bodyText.nativeElement.scrollHeight > viewableHeight){
      // if the text's height is more thant the normal viewable : show the fade out
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    }else{
      // there is no text overflow, hide the fadeout truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  onXButtonClick(): void{
    this.deleteEvent.emit();
  }
}
