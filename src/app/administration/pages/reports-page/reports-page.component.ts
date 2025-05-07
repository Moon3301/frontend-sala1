import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { formatDateYMD } from '../../../common/helpers';

interface OptionsSelect {
  name: string;
  opt: string;
}

@Component({
  selector: 'app-reports-page',
  standalone: false,

  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit {

  options: OptionsSelect[] | undefined;

  isDate: boolean = false;
  customDate?: string;

  reportsForm!: FormGroup

  constructor(private readonly admService: AdministrationService, private fb: FormBuilder){}

  ngOnInit(): void {

    this.options = [
      { name: 'Todos los registros', opt: ''},
      { name: 'Hoy', opt: 'today'},
      { name: 'Otra fecha', opt: 'custom'},
    ]

    this.reportsForm = this.fb.group({
      selectedDate: [''],
      selectedOpt: ['']
    })

  }

  selectedOption(): void {
    const opt = this.reportsForm.value.selectedOpt;
    console.log(opt);

    switch (opt.opt) {
      case 'today':
        this.isDate = false;
        this.customDate = formatDateYMD(new Date())
        console.log(this.customDate);

        break;

      case 'custom':
        this.isDate = true;
        this.customDate = undefined;        // se llenará con el datepicker
        console.log(this.customDate);
        break;

      default:                              // 'Todos los registros'
        this.isDate = false;
        this.customDate = undefined;
    }
  }


  downloadReport(): void {
    this.admService.downloadReports(this.customDate).subscribe({
      next: blob => {
        const filename = `showtimes${this.customDate ? '-' + this.customDate : ''}.xlsx`;
        saveAs(blob, filename);
      },
      error: err => console.error('La descarga falló', err),
    });
  }

  onDatePicked(date: Date): void {
    this.customDate = formatDateYMD(date);
    console.log('Picker ->', this.customDate);
  }

  isDisabled(): boolean {
    const opt = this.reportsForm.value.selectedOpt;
    return !opt || (opt === 'custom' && !this.customDate);
  }



}
