import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgxFileDropEntry} from "ngx-file-drop";

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.less']
})
export class FileInputComponent {
  @ViewChild('fileInput') fileInput;

  @Input() accept = '*';

  @Input() displayLink = false;
  @Input() disabled = false;
  @Input() disabledDeleteButton = false;

  @Output() fileCompressionErrorCallback = new EventEmitter();
  @Output() fileSelectionCallback = new EventEmitter();
  @Output() fileDeletionCallback = new EventEmitter();

  file: File;
  public files: NgxFileDropEntry[] = [];
  public displayError = false;

  constructor() {
  }

  public handleFileDrop(files: NgxFileDropEntry[]): void {
    this.deleteFile();
    if (!files[0]) {
      return;
    }

    this.displayError = false;
    let draggedFile = files.find((file: any) => file.fileEntry.filesystem) || files[0];

    if (draggedFile.fileEntry.isFile) {
      const fileEntry = draggedFile.fileEntry as FileSystemFileEntry;
      if (fileEntry.name) {
        fileEntry.file((file: File) => {
          this.file = file;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          this.fileSelectionCallback.emit();
        });
      } else {
        this.fileCompressionErrorCallback.emit();
      }
    }
  }

  deleteFile(): void {
    this.file = null;
    this.fileDeletionCallback.emit();
  }

}
