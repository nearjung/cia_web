
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public getPersonal(firstname: string, lastname: string = '', membId: string) {
    let params = '?firstname=' + firstname + '&lastname=' + lastname + '&membId=' + membId;
    return this.httpClient.get<any>(this.configService.getAPI('api/personal/get.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getPersonalInfo(idCard: string, memberId: string, password: string) {
    let params = '?idCard=' + idCard + '&memberId=' + memberId + '&password=' + password;
    return this.httpClient.get<any>(this.configService.getAPI('api/personal/getPerson.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}