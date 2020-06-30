import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { PersonalComponent } from './search/personal/personal.component';
import { VehicleComponent } from './search/vehicle/vehicle.component';
import { CompanyComponent } from './search/company/company.component';
import { ToolComponent } from './search/tool/tool.component';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'personal', component: PersonalComponent},
  { path: 'company', component: CompanyComponent},
  { path: 'vehicle', component: VehicleComponent},
  { path: 'tool', component: ToolComponent},
  { path: 'login', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
