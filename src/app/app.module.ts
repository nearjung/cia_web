import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ConfigServerService } from './core/config-server.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { PersonalComponent } from './pages/search/personal/personal.component';
import { CompanyComponent } from './pages/search/company/company.component';
import { VehicleComponent } from './pages/search/vehicle/vehicle.component';
import { ToolComponent } from './pages/search/tool/tool.component';
import { ProfileComponent } from './pages/member/profile/profile.component';
import { LogviewComponent } from './pages/member/logview/logview.component';
import { ConfirmMemberComponent } from './pages/admin/confirm-member/confirm-member.component';
import { MemberComponent } from './pages/admin/member/member.component';
import { MenuManageComponent } from './pages/admin/menu-manage/menu-manage.component';
import { CreditManageComponent } from './pages/admin/credit-manage/credit-manage.component';
import { UserLogComponent } from './pages/admin/user-log/user-log.component';
import { ApiLogComponent } from './pages/admin/api-log/api-log.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LoadingComponent } from './control/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonalComponent,
    CompanyComponent,
    VehicleComponent,
    ToolComponent,
    ProfileComponent,
    LogviewComponent,
    ConfirmMemberComponent,
    MemberComponent,
    MenuManageComponent,
    CreditManageComponent,
    UserLogComponent,
    ApiLogComponent,
    LoginComponent,
    HomeComponent,
    LoadingComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [ConfigServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
