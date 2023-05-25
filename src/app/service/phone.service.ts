
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public get(telephone: string) {
    return this.httpClient.get<any>(this.configService.getAPI('api/telephone/get.php?phone=' + telephone)).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}