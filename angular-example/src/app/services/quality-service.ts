import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Token} from "../model/token";
import {Observable} from "rxjs";
import {Engine} from "../model/engine";
import {environment} from "../../enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class QualityService {
  tokenEndpoint: string = '/keycloak/realms/docsquality/protocol/openid-connect/token';
  predictionEndpoint: string = '/api/engine/quality'

  constructor(private httpClient: HttpClient) {
  }

  public getAccessToken(): Observable<Token> {
    /**
     * Use the client credentials in order to obtain a token used for accessing prediction API
     *
     * @note Enter the client credentials (online version) from your DocsQuality account
     * in the environment file {@link environment}
     */
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    let payload: HttpParams = new HttpParams().set('grant_type', 'client_credentials')
      .set('client_id', environment.clientId)
      .set('client_secret', environment.clientSecret);

    return this.httpClient.post<Token>(this.tokenEndpoint, payload, {headers});
  }

  public getPredictionResults(file: File, accessToken: Token, ocrIndex: boolean = false, documentCategory: boolean = false, password?: string): Observable<Engine> {
    /**
     * Send the token with a file in order to get quality prediction results
     * If the file is password protected a password has to be inputted as well
     */
    const formData: FormData = new FormData();
    formData.append('file', file);

    const params: HttpParams = new HttpParams()
      .set("preview", true)
      .set("ocrIndex", ocrIndex)
      .set("docCategory", documentCategory);

    if (password) {
      formData.append('password', password);
    }
    const headers = {'Authorization': `Bearer ${accessToken.access_token}`, 'Accept-Language': 'en-US'}
    return this.httpClient.post<Engine>(this.predictionEndpoint, formData, {headers: headers, params: params});
  }
}
