import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
  exports: [
    CommonModule,
    ButtonModule,
    PickListModule,
    ToastModule,
    ProgressSpinnerModule,
    MessageModule,
    CardModule,
    GalleriaModule,
    TableModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    DatePickerModule
  ],
})
export class PrimengModule { }
