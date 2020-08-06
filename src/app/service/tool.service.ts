
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public getProvinces() {
    //let params = '?firstname=';
    return this.httpClient.get<any>(this.configService.getAPI('api/searchtools/getProvince.php')/* + params*/).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getAmphure(province: string) {
    let params = '?province=' + province;
    return this.httpClient.get<any>(this.configService.getAPI('api/searchtools/getAmphure.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getTambon(amphure: string) {
    let params = '?amphure=' + amphure;
    return this.httpClient.get<any>(this.configService.getAPI('api/searchtools/getTambon.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getSearch(memberId: string, password: string, gender: string, age1: string = '1', age2: string = '100', province: string, car: string, yearcar: string,
    motor: string, yearmotor: string, ensure: string, email: string, telephone: string, top: string, tambon: string, amphure: string, getcount: string = '') {
    let params = '?memberId=' + memberId + '&password=' + password + '&getcount=' + getcount + '&gender=' + gender + '&age1=' + age1 + '&age2=' + age2 + '&province=' + province + '&car=' + car + '&yearcar=' + yearcar + '&motor=' + motor + '&yearmotor=' + yearmotor + '&ensure=' + ensure + '&email=' + email + '&telephone=' + telephone + '&top=' + top + '&tambon=' + tambon + '&amphure=' + amphure;
    return this.httpClient.get<any>(this.configService.getAPI('api/searchtools/get.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getSearchCompany(memberId: string, password: string, companyType: string, capital: string, profit: string, employee: string, limit: string) {
    let params = '?memberId=' + memberId + '&password=' + password + '&companyType=' + companyType + '&registeredCapital=' + capital + '&profit=' + profit + '&employee=' + employee + '&limit=' + limit;
    return this.httpClient.get<any>(this.configService.getAPI('api/searchtools/getCompany.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getSearchVehicle(memberId: string, password: string, brand: string, yearmin: string, yearmax: string, province: string, limit: string) {
    let params = '?memberId=' + memberId + '&password=' + password + '&brand=' + brand + '&yearmin=' + yearmin + '&yearmax=' + yearmax + '&province=' + province + '&limit=' + limit;
    return this.httpClient.get<any>(this.configService.getAPI('api/searchtools/getVehicle.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getTier() {
    return this.httpClient.get<any>(this.configService.getAPI('api/searchtools/getTier.php')).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }
}