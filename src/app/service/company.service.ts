
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public getCompany(companyName: string, capital1: string, capital2: string, objective: string, province: string, memberId: string, mode: string) {
    let params = '?companyName=' + companyName + '&membId=' + memberId + '&mode=' + mode + '&capital1=' + capital1 + '&capital2=' + capital2 + '&objective=' + objective + '&province=' + province;
    return this.httpClient.get<any>(this.configService.getAPI('api/company/get.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getCompanyInfo(memberId: string, password: string, compId: string) {
    let params = '?memberId=' + memberId + '&password=' + password + '&compId=' + compId;
    return this.httpClient.get<any>(this.configService.getAPI('api/company/getCompany.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}