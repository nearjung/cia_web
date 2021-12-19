
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';
import { config } from '../core/config';
@Injectable({
  providedIn: 'root'
})
export class BatchService {
  public user: any = JSON.parse(localStorage.getItem("userData"));

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public searchBatch(data: any) {
    return this.httpClient.post<any>(this.configService.getAPI('api/batch/csvSearch.php'), data).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}