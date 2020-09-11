
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';
import { config } from '../core/config';
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  public user: any = JSON.parse(localStorage.getItem("userData"));

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

  public addCredit(email, amount, mode: string = 'add') {
    // var param = {
    //   email: email,
    //   amount: amount,
    //   mode: mode
    // }
    let params = '?mode=' + mode + '&email=' + email + '&amount=' + amount;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/creditManage.php') + params).pipe(
      map(respons => {
        this.user.credit = this.user.credit - amount;
        localStorage.setItem("userData", JSON.stringify(this.user));
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

  public register(email: string, password: string, titleName: string, fullName: string, idCard: string, telephone: string, token: string) {
    let params = '?email=' + email + '&password=' + password + '&titleName=' + titleName + '&fullName=' + fullName + '&idCard=' + idCard + '&telephone=' + telephone + '&token=' + token;
    return this.httpClient.get<any>(this.configService.getAPI('api/user/register.php') + params).pipe(
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

  public getlogMember(memberId) {
    let params = '?memberId=' + memberId;
    return this.httpClient.get<any>(this.configService.getAPI('api/user/getLogMember.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getMenu(member_id) {
    let params = '?member_id=' + member_id;
    return this.httpClient.get<any>(this.configService.getAPI('api/user/getMenu.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  /** Admin Zone */
  public confirmUser(membId) {
    let params = '?membId=' + membId;
    return this.httpClient.get<any>(this.configService.getAPI('api/admin/confirmUser.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public checkPoint(memberId, password, price) {
    let params = '?memberId=' + memberId + '&password=' + password + '&price=' + price;
    return this.httpClient.get<any>(this.configService.getAPI('api/user/checkPoint.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));

  }

  public sendMail(to: string, subject: string, text: string, service: string = config.email.server, user: string = config.email.user, password: string = config.email.password) {
    var data = {
      mailService: service,
      mailUser: user,
      mailPassword: password,
      mailTo: to,
      mailSubject: subject,
      mailText: text,
    }
    return this.httpClient.post<any>(this.configService.getAPINode('email/sendMail'), data).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

  public getActive(token) {
    let params = '?token=' + token;
    return this.httpClient.get<any>(this.configService.getAPI('pages/access.php') + params).pipe(
      map(respons => {
        return {
          serviceResult: respons
        }
      }));
  }

}