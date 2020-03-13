import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent, SafePipe } from './content.component';

@NgModule({
  declarations: [
    ContentComponent
  , SafePipe
],
  imports: [
    CommonModule
  ]
})
export class ContentModule { }
