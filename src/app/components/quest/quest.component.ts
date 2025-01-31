/*
 * Created by bvasiliev on 25.11.2024
*/
import {JsonPipe, NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {EchartsxModule} from 'echarts-for-angular';
import {CandlesComponent} from '../candles/candles.component';
import {ChartService} from '../../services/chart.service';
import {DialogData, PopupSettingsComponent} from '../popup-settings/popup-settings.component';

@Component({
  selector: "quest",
  templateUrl: './quest.component.html',
  imports: [
    CandlesComponent,
    NgIf,
    FormsModule,
    EchartsxModule,
    JsonPipe,
  ],
  standalone: true,
  styleUrl: './quest.component.css'
})

export class QuestComponent implements OnInit {

  result: DialogData | undefined;

  // ------> data to input / request
  public isSettingsStart = true;
  public movingAvesList = [3, 5, 8, 21, 34]; // choice of the user in selection component
  public forecastPeriod = 20;
  public dataPosition: number = 1;

  public wholeSourceData: any[] = [];
  public tickers: string[] = [];
  public predictDirectionArray: string[] = [];
  public predictMoveValues: number[] = [];
  public pipDecimalValues: number[] = [];

  public chartNumber: number = 1;
  public totalNumberOfCharts: number;
  public currentData: any[][] = [];
  public chartService: ChartService;


  constructor(public dialog: MatDialog) {

    this.chartService = new ChartService();
    this.tickers = this.chartService.getTickersAvailable();

    this.loadWholeData();

    this.totalNumberOfCharts = this.wholeSourceData.length;

    for (let i = 0; i < this.totalNumberOfCharts; i++) { //init predict direction array for all the charts to pass through
      this.predictDirectionArray.push('0');
    }
  }

  ngOnInit() {
    if (this.isSettingsStart) this.openDialogSettings();

    this.currentData = this.provideCurrentData();
  }

  protected provideCurrentData() {
    return this.wholeSourceData[this.chartNumber - 1];
  }

  protected loadWholeData() {
    const result = this.chartService.getCandlesData();
    this.wholeSourceData = result.candlesArray;
    this.pipDecimalValues = result.pipDecimals;
    this.predictMoveValues = result.predictMoveValues;
  }

  public isDataLoaded() {
    return !!this.currentData;
  }

  // click next button
  public clickNext() {
    this.chartNumber = this.chartNumber === this.totalNumberOfCharts ? 1 : (this.chartNumber + 1);
    this.currentData = this.provideCurrentData();

    this.isSettingsStart = false;
  }

  // click back button
  public clickBack() {
    this.chartNumber = this.chartNumber === 1 ? this.totalNumberOfCharts : (this.chartNumber - 1);
    this.currentData = this.provideCurrentData();
  }

  openDialogSettings(): void {
    const dialogRef = this.dialog.open(PopupSettingsComponent, {
      width: '700px',
      height: 'auto',
      data: {
        totalChartsNum: 30, testChartsNum: 3, edgeChartsNum: 3, dealDuration: 24, forecastPeriod: 20, tickers: this.tickers, tickersSelected: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.result = result;
        console.log('Settings dialog result: ', result);
      }
    });
  }

}
