import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FileInputComponent} from "../file-input/file-input.component";

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.less']
})
export class UploadFormComponent {

  @ViewChild(FileInputComponent) fileInput: FileInputComponent;

  @Input() accept: string;
  @Input() disabled: boolean;

  @Output() fileCompressionErrorCallback: EventEmitter<boolean> = new EventEmitter();
  @Output() uploadCallback: EventEmitter<File> = new EventEmitter<File>();
  @Output() deleteCallback: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  get file(): File {
    return this.fileInput.file;
  }

  deleteFile(): void {
    this.fileInput.deleteFile();
  }

}
