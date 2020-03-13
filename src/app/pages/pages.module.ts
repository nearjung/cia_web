import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { PagesRoutingModule } from './pages-routing.module';
import { MainModule } from './main/main.module';
import { ContentModule } from './content/content.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MainModule,
    ContentModule,
  ]
})
export class PagesModule { }
