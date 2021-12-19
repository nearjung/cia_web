import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { ActiveComponent } from './active/active.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoadingComponent } from './control/loading/loading.component';
import { ForgetpassComponent } from './forgetpass/forgetpass.component';
import { AuthInterceptor } from './authorization/auth.interceptor';
import { HistoryComponent } from './pages/search/history/history.component';
import { ExcelSearchComponent } from './pages/search/excelsearch/excelsearch.component';

// Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgxCsvParserModule } from 'ngx-csv-parser';

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
    RegisterComponent,
    ActiveComponent,
    ForgetpassComponent,
    HistoryComponent,
    ExcelSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    NgxCsvParserModule,
    ToastrModule.forRoot()
  ],
  providers: [ConfigServerService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
