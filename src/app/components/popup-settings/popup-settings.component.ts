import {NgForOf} from '@angular/common';
import {Component, Inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,

} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatListOption, MatSelectionList} from '@angular/material/list';

export interface DialogData {
  totalChartsNum: number;
  testChartsNum: number;
  edgeChartsNum: number;
  dealDuration: number;
  forecastPeriod: number;
  tickers: string[];
  tickersSelected: string[];
  avesPeriods: number[];
}



@Component({
  selector: 'app-popup-settings',
  templateUrl: './popup-settings.component.html',
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelectionList,
    MatListOption,
    NgForOf,
    ReactiveFormsModule
  ],
  standalone: true,
  styleUrls: ['./popup-settings.component.css'],
})
export class PopupSettingsComponent {

  constructor(public dialogRef: MatDialogRef<PopupSettingsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onCancel(): void {
    // Perform save logic here
    this.dialogRef.close();
  }

  onProceed(): void {
    // this.data.tickersSelected = this.tickersSelected;
  }

}
