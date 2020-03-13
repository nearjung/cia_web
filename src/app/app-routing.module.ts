import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';


const routes: Routes = [
  { path: '', loadChildren: './pages/pages.module#PagesModule' },
  // {
  //   path: '',
  //   component: AnimeComponent,
  // },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
