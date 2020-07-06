
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

  public getMemberInfo(memberId) {
    let params = '?membId=' + memberId;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getUserDetail.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public addCredit(email, amount) {
    let params = '?mode=add&email=' + email + '&amount=' + amount;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/creditManage.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getActiveMenu(memberId) {
    let params = '?membId=' + memberId;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getMenuActive.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getDisableMenu(memberId) {
    let params = '?membId=' + memberId;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getMenuDisable.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getMenuList() {
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getMenuList.php')).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getMenuById(menuId) {
    let params = '?menuId=' + menuId;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getMenuById.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public updateMenu(menuId, menuName, menuLink, menuPrice) {
    let params = '?menuId=' + menuId + '&menuName=' + menuName + '&menuLink=' + menuLink + '&menuPrice=' + menuPrice;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/updateMenu.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public manageMenu(mode, membId, menuId, by) {
    if (mode == 'active') {
      let params = '?membId=' + membId + '&menuId=' + menuId + '&by=' + by;
      return this.httpClient.get<any>(this.configService.getAPI('api/admin/addMenuUser.php') + params).pipe(
        map(respons => {
          return {
            serviceResult: respons
          }
        }));
    } else if (mode == 'disable') {
      let params = '?membId=' + membId + '&menuId=' + menuId + '&by=' + by;
      return this.httpClient.get<any>(this.configService.getAPI('api/admin/deleteMenuUser.php') + params).pipe(
        map(respons => {
          return {
            serviceResult: respons
          }
        }));
    }
  }

  public getApi() {
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getApi.php')).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getApiLog(cert) {
    let params = '?cert=' + cert;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/getApiLog.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}