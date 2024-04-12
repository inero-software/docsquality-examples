import {HttpClient} from '@angular/common/http';
import {provideTransloco, Translation, TranslocoLoader, TranslocoModule} from '@ngneat/transloco';
import {Injectable, NgModule} from '@angular/core';
import {Observable} from "rxjs";


@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {
  }

  getTranslation(): Observable<Translation> {
    const timestamp: number = new Date().getTime();
    return this.http.get<Translation>(`/assets/i18n/en.json?_=${timestamp}`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
      },
      loader: TranslocoHttpLoader
    }),
  ]
})
export class TranslocoRootModule {
}
