/*
 * Created by bvasiliev on 25.11.2024
*/
import {NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {EchartsxModule} from 'echarts-for-angular';
import {CandlesComponent} from '../candles/candles.component';
import {ChartService} from '../../services/chart.service';

@Component({
  selector: "quest",
  templateUrl: './quest.component.html',
  imports: [
    CandlesComponent,
    NgIf,
    FormsModule,
    EchartsxModule,
  ],
  standalone: true,
  styleUrl: './quest.component.css'
})

export class QuestComponent implements OnInit {

  // ------> data to input / request
  public movingAvesList = [3, 5, 8, 21, 34]; // choice of the user in selection component
  public pipDecimals: number = 2;
  public predictMoveInUnits: number = 200;
  public wholeSourceData: any[][][] = [];
  public forecastPeriod = 20;
  public dataPosition: number = 1;

  public predictDirectionArray: string[] = [];
  public chartNumber: number = 1;
  public totalNumberOfCharts: number;
  public currentData: any[][] = [];
  public chartService: ChartService;

  constructor() {
    this.chartService = new ChartService();
    this.wholeSourceData = this.loadWholeData();

    this.totalNumberOfCharts = this.wholeSourceData.length;
    for (let i = 0; i < this.totalNumberOfCharts; i++) { //init predict direction array for all the charts to pass through
      this.predictDirectionArray.push('0');
    }
  }

  ngOnInit() {
    this.currentData = this.provideCurrentData();
  }

  public convertUnitsToPips() {
    return this.predictMoveInUnits * Math.pow(10, this.pipDecimals);
  }

  protected provideCurrentData() {
    return this.wholeSourceData[this.chartNumber - 1];
  }

  protected loadWholeData() {
    return this.chartService.getCandlesData();
  }

  public isDataLoaded() {
    return !!this.currentData;
  }

  // click next button
  public clickNext() {
    this.chartNumber = this.chartNumber === this.totalNumberOfCharts ? 1 : (this.chartNumber + 1);
    this.currentData = this.provideCurrentData();
  }

  // click back button
  public clickBack() {
    this.chartNumber = this.chartNumber === 1 ? this.totalNumberOfCharts : (this.chartNumber - 1);
    this.currentData = this.provideCurrentData();
  }

}
