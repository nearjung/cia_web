
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

  public getPersonal(searchTxt: string = '', membId: string, password: string, mode: string, province: string) {
    let params = '?searchtext=' + searchTxt + '&membId=' + membId + '&password=' + password + '&mode=' + mode + '&province=' + province;
    return this.httpClient.get<any>(this.configService.getAPI('api/personal/get.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getPersonalInfo(data: any) {
    return this.httpClient.post<any>(this.configService.getAPI('api/personal/getPerson.php'), data).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }
  
  public getPersonalInfoSingle(idCard: string, memberId: string, password: string) {
    let params = '?idCard=' + idCard + '&memberId=' + memberId + '&password=' + password;
    return this.httpClient.get<any>(this.configService.getAPI('api/personal/getPersonOne.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getPersonalArray(idCard: string, memberId: string, password: string) {
    let params = '?idCard=' + idCard + '&memberId=' + memberId + '&password=' + password;
    return this.httpClient.get<any>(this.configService.getAPI('api/personal/getPersonArray.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}