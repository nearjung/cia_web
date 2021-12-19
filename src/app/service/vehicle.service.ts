
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

  public getVehicle(memberid: string, type: string, searchTxt, searchTxt2, province, mode: string) {
    let params = '?memberid=' + memberid + '&type=' + type + '&searchTxt=' + searchTxt + '&searchTxt2=' + searchTxt2 + '&province=' + province + '&mode=' + mode;
    return this.httpClient.get<any>(this.configService.getAPI('api/vehicle/get.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getVehicleInfo(memberId: string, password: string, plate1: string, plate2: string, numBody: string, numEng: string, mode: string) {
    let params = '?memberId=' + memberId + '&password=' + password + '&plate1=' + plate1 + '&plate2=' + plate2 + '&numBody=' + numBody + '&numEng=' + numEng + '&mode=' + mode;
    return this.httpClient.get<any>(this.configService.getAPI('api/vehicle/getCar.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}