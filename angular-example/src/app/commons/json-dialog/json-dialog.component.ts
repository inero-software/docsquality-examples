import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {prettyPrintJson} from 'pretty-print-json';

@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
  styleUrls: ['./json-dialog.component.css']
})
export class JsonDialogComponent implements OnChanges {
  @ViewChild("jsonContainer") jsonContainer: ElementRef;
  @Input() title: string;
  @Input() buttonLabel: string;
  @Input() object: Object;

  @Output() buttonCallback: EventEmitter<any> = new EventEmitter();

  visible: boolean;

  constructor() {
  }

  ngOnChanges(): void {
    if (this.object) {
      this.jsonContainer.nativeElement.innerHTML = prettyPrintJson.toHtml(this.object);
    }
  }

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }
}
