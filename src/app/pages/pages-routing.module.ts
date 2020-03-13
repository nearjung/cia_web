import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component'
import { PersonalSearchComponent } from './personal-search/personal-search.component'

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'personal', component: PersonalSearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
