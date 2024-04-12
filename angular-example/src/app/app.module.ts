import {APP_INITIALIZER, NgModule} from "@angular/core";

import {AppComponent} from './app.component';
import {UploadFormComponent} from "./commons/upload-form/upload-form.component";
import {FileInputComponent} from "./commons/file-input/file-input.component";
import {NgxFileDropModule} from "ngx-file-drop";
import {CommonModule} from "@angular/common";
import {MessageService} from "primeng/api";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {PredictionResultsComponent} from "./components/prediction/prediction-results/prediction-results.component";
import {KnobModule} from "primeng/knob";
import {FormsModule} from "@angular/forms";
import {AccordionModule} from "primeng/accordion";
import {DialogComponent} from "./commons/dialog/dialog.component";
import {DialogModule} from "primeng/dialog";
import {SidebarModule} from "primeng/sidebar";
import {InputBarComponent} from "./components/input-bar/input-bar.component";
import {BrowserModule} from '@angular/platform-browser';
import {PredictionComponent} from "./components/prediction/prediction.component";

import {HttpClientModule} from "@angular/common/http";
import {JsonDialogComponent} from "./commons/json-dialog/json-dialog.component";
import {DocPreviewComponent} from "./commons/doc-preview/doc-preview.component";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {TooltipModule} from "primeng/tooltip";
import {TranslocoRootModule} from "./transloco-root.module";
import {TranslocoModule, TranslocoService} from "@ngneat/transloco";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from "primeng/button";
import {NgxLoadingModule} from "ngx-loading";
import {ToastModule} from "primeng/toast";
import {UnderlineBeautifyPipe} from "./pipes/underline-beautify.pipe";
import {DividerModule} from "primeng/divider";

function initializeTranslation(translocoService: TranslocoService) {
  return () => {
    translocoService.setActiveLang('en');
  };
}

@NgModule({

  imports: [
    NgxFileDropModule,
    BrowserAnimationsModule,
    KnobModule,
    FormsModule,
    AccordionModule,
    DialogModule,
    BrowserModule,
    CommonModule,
    SidebarModule,
    HttpClientModule,
    PdfViewerModule,
    TooltipModule,
    TranslocoModule,
    TranslocoRootModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ButtonModule,
    NgxLoadingModule,
    ToastModule,
    DividerModule,
  ],
  declarations: [
    AppComponent,
    UploadFormComponent,
    FileInputComponent,
    PredictionResultsComponent,
    DialogComponent,
    InputBarComponent,
    PredictionComponent,
    JsonDialogComponent,
    DocPreviewComponent,
    UnderlineBeautifyPipe
  ],
  exports: [],
  providers: [
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslation,
      multi: true,
      deps: [TranslocoService],
    },
  ],
  schemas: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
