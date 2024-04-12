import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import $ from 'openseadragon';
import {PDFtoIMG} from "../../utils/file-utils";
import {MessageService} from "primeng/api";
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrls: ['./doc-preview.component.css']
})
export class DocPreviewComponent implements OnInit {

  @ViewChild('container') container: ElementRef;

  @Input() src: string;
  @Input() fullSize: boolean;
  @Input() isPdf: boolean;
  @Input() page: number;
  @Input() showPredictButton: boolean
  @Input() password: string;

  @Output() onCloseClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onLoadFileClick: EventEmitter<any> = new EventEmitter<any>();

  viewer: any;
  initialized: boolean = false;

  constructor(private ngZone: NgZone,
              private messageService: MessageService,
              private translocoService: TranslocoService) {
  }

  ngOnInit(): void {
    this.initialized = false;
    if (this.isPdf) {
      PDFtoIMG(this.src, this.page, this.password).then((promise): void => {
        this.src = promise;
        this.runOpenSeaDragon()
      }).catch((): void => {
        this.closeViewer();
        this.onViewerError();
      })
    } else {
      this.runOpenSeaDragon();
    }
  }

  private onViewerError(): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translocoService.translate('product.errors.preview')
    });
  }

  private runOpenSeaDragon(): void {
    this.ngZone.runOutsideAngular((): void => {
      setTimeout((): void => {
        this.viewer = $({
          element: this.container.nativeElement,
          prefixUrl: 'https://cdn.jsdelivr.net/gh/Benomrans/openseadragon-icons@main/images/',
          constrainDuringPan: true,
          visibilityRatio: 1,
          minPixelRatio: 1,
          showFullPageControl: false,
          maxZoomLevel: 3,
          tileSources: {
            url: this.src,
            type: 'image',
            buildPyramid: false,
            crossOriginPolicy: 'Anonymous',
            ajaxWithCredentials: false,
          }
        });
      });
    });
    this.initialized = true;
  }

  @HostListener('document:keydown.escape', ['$event'])
  closeViewer(): void {
    this.fullSize = false;
    this.onCloseClick.emit();
  }

}
