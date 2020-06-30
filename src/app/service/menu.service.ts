
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public getUserMenu(memberId: string) {
    let params = '?member=' + memberId;
    return this.httpClient.get<any>(this.configService.getAPI('Scan/getVisit') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }


}