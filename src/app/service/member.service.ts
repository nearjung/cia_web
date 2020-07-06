
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public userLogin(email: string, password: string) {
    let params = '?email=' + email + '&password=' + password;
    return this.httpClient.get<any>(this.configService.getAPI('api/user/userLogin.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getAllMember() {
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getUserall.php')).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}