import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { PrimengModule } from '../primeng/primeng.module';

import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AdministrationPageComponent } from './pages/administration-page/administration-page.component';

import { AdministrationService } from './services/administration.service';
import { UpdateRecordsPageComponent } from './pages/update-records-page/update-records-page.component';
import { EditCarruselPageComponent } from './pages/edit-carrusel-page/edit-carrusel-page.component';
import { EditMoviesPagesComponent } from './pages/edit-movies-pages/edit-movies-pages.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

@NgModule({
  declarations: [
    LayoutPageComponent,
    AdministrationPageComponent,
    UpdateRecordsPageComponent,
    EditMoviesPagesComponent,
    EditCarruselPageComponent,
    ReportsPageComponent,

  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    PrimengModule,
    MatTableModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  providers: [
    AdministrationService
  ]
})
export class AdministrationModule { }
