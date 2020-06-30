import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { PersonalComponent } from './pages/search/personal/personal.component';

const routes: Routes = [
  { path: '', loadChildren: './pages/pages.module#PagesModule' },
  
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
