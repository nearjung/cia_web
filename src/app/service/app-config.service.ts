import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig;
  public isNetworkConnected = true;
  
  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get(environment.configPath)
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }

  showNetworkError() {
    //this.toastr.error("เกิดข้อผิดพลาด ! กรุณาตรวจสอบการเชื่อมต่อ Network.");
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด !',
      text: 'กรุณาตรวจสอบการเชื่อมต่อ Network.'
    });
  }

}