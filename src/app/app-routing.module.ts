import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { PersonalComponent } from './pages/search/personal/personal.component';
import { RegisterComponent } from './register/register.component';
import { VehicleComponent } from './pages/search/vehicle/vehicle.component';
import { CompanyComponent } from './pages/search/company/company.component';
import { ToolComponent } from './pages/search/tool/tool.component';
import { ActiveComponent } from './active/active.component';
import { MemberComponent } from './pages/admin/member/member.component';
import { ProfileComponent } from './pages/member/profile/profile.component';
import { ForgetpassComponent } from './forgetpass/forgetpass.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HistoryComponent } from './pages/search/history/history.component';
import { ExcelSearchComponent } from './pages/search/excelsearch/excelsearch.component';

const routes: Routes = [
  { path: 'pages', loadChildren: './pages/pages.module#PagesModule' },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'personal', component: PersonalComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'vehicle', component: VehicleComponent },
  { path: 'tool', component: ToolComponent },
  { path: 'admin', component: MemberComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'forgetpass', component: ForgetpassComponent },
  { path: 'active', component: ActiveComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'excelsearch', component: ExcelSearchComponent }
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
