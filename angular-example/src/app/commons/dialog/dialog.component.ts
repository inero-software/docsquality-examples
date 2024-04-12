import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import $ from "jquery";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent implements OnInit, OnDestroy {
  @ViewChild("inputElement") inputElement: ElementRef;
  @Input() title;
  @Input() button1Label: string;
  @Input() button2Label: string;
  @Input() button1Class = '';
  @Input() button2Class = '';
  @Input() icon = 'fa-exclamation-triangle';
  @Input() closeable = false;
  @Input() backdrop: (true | false | 'static') = 'static';
  @Input() centered = false;
  @Input() button2SpinnerEnabled = false;
  @Input() width = '500px';
  @Input() height = '265px';
  @Input() disableButton2 = false;
  @Input() disableButton1 = false;
  @Input() button1Loading = false;
  @Input() button2Loading = false;

  @Output() button1Callback: EventEmitter<any> = new EventEmitter();
  @Output() button2Callback: EventEmitter<any> = new EventEmitter();
  @Output() closeCallback: EventEmitter<any> = new EventEmitter();

  _visible = false;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    $(this.elementRef.nativeElement).detach().appendTo('body');

    $(this.getDialog()).on('show.bs.modal', () => this._visible = true);
    $(this.getDialog()).on('hidden.bs.modal', () => this._visible = false);
  }

  button1Click(): void {
    this.button1Callback.emit();
  }

  button2Click(): void {
    this.button2Callback.emit();
  }

  show(): void {
    this._visible = true;
  }

  hide(): void {
    this._visible = false;
  }

  private getDialog() {
    return this.elementRef.nativeElement.querySelector('[role=dialog]');
  }

  ngOnDestroy(): void {
    this._visible ? $(this.getDialog()).on('hidden.bs.modal', () => this.removeFromDOM()) : this.removeFromDOM();
  }

  private removeFromDOM(): void {
    $(this.elementRef.nativeElement).remove();
  }
}
