import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ConfigServerService } from '../core/config-server.service';
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable()
export class AnimeService {

  constructor(private http: Http , private configServerService:ConfigServerService) {}

    public getAnimeCount(category: string): Observable<any> {
        let param = '?&catalogId=' + category;
        return this.http.get(this.configServerService.getAPI('anime/getCountAnime') + param)
        .map(respons => {
          return {
              serviceResult: respons.json()
          }
      });
    }
  
    public getAnimeList(catalogId: string, start: string, end: string): Observable<any> {
        let param = '?&visitId=' + catalogId + '&start=' + start + '&end=' + end;
        return this.http.get(this.configServerService.getAPI('Lab/getOrderLab') + param)
        .map(respons => {
          return {
              serviceResult: respons.json()
          }
      });
    }
}

