import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from "@angular/core";
import {EChartsOption} from 'echarts';
import {EchartsxModule} from "echarts-for-angular";
import * as echarts from 'echarts';

@Component({
  selector: "candles",
  templateUrl: './candles.component.html',
  standalone: true,
  imports: [
    EchartsxModule
  ],
  styleUrl: './candles.component.css'
})

export class CandlesComponent implements AfterViewInit {

  // ------> data to input / request
  @Input() sourceData: any[] = [];
  @Input() avesWndList = [5, 13, 21, 34]; // choice of the user in selection component
  @Input() pipDecimals: number = 2;
  @Input() predictMoveValue: number = 200 * Math.pow(10, this.pipDecimals);
  @Input() forecastPeriod = 20;
  @Input() dataPosition: number = 1;
  @Input() predictDirection: number = 0;
  @Input() chartNumber: number = 1;
  @Input() totalNumberOfCharts: number = 30;

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private linesToDraw: any[] = [];
  private drawCandlesVariants: any[][] = [];
  private categoryData: number[] = [];
  private realDataLength: number = 0;

  private readonly chartBgColor = '#f6f6f6';

  private readonly downColor = '#ec0000';
  private readonly downBorderColor = '#8A0000';
  private readonly upColor = '#00da3c';
  private readonly upBorderColor = '#008F28';

  private upTargetValue: number = 0;
  private dnTargetValue: number = 0;
  private readonly upTargetColor = '#2a7dea';
  private readonly dnTargetColor = '#f84646';
  private readonly targetLineWidth = 3;
  private readonly targetLinesOpacity = 1;
  private readonly plotPaddingRight = 2;

  private myChart: any;

  ngAfterViewInit() {

    // console.log(this.sourceData);

    setTimeout(() => { // to ensure the parent container size is received by the chart
      this.makeCandlesDataOutcomes(this.sourceData);
      this.myChart = echarts.init(this.chartContainer.nativeElement);

      this.upTargetValue = +(+(this.drawCandlesVariants[0][this.realDataLength - 1][this.dataPosition])
        + +(this.predictMoveValue / Math.pow(10, this.pipDecimals)).toFixed(this.pipDecimals));
      this.dnTargetValue = +(+(this.drawCandlesVariants[0][this.realDataLength - 1][this.dataPosition])
        - +(this.predictMoveValue / Math.pow(10, this.pipDecimals)).toFixed(this.pipDecimals));

      this.linesToDraw = this.formAveragesDrawSet(this.avesWndList);

      this.myChart.setOption(this.setChartOptions());
      // this.myChart.resize();
    }, 50); // Delay of 0ms ensures the code runs after the current call stack is cleared
  }

  private makeCandlesDataOutcomes(rawData: (number | string)[][]) {

    this.realDataLength = rawData.length - (2 * this.forecastPeriod);

    // makes categories for whole the row including predict area
    this.categoryData = new Array(this.realDataLength + this.forecastPeriod + this.plotPaddingRight).fill(null).map((_, i) => i + 1);

    let values: any[][] = [];

    rawData.forEach(x => x.splice(0, 1)); // remove dates - 1st column
    for (let i = 0; i < this.realDataLength; i++) {
      // rawData[i].splice(0, 1);// delete element indexed 0
      values.push(rawData[i])
    }

    // fill in draw variants with the same real data
    let stringValues = JSON.stringify(values);
    for (let i = 0; i < 3; i++) {
      this.drawCandlesVariants[i] = JSON.parse(stringValues);
    }

    // add predicts for each variant (0 -> dn, 1 -> no predict, 2 -> up predict)
    let candleDummy = JSON.parse(JSON.stringify(rawData[0])); // dummy of empty data line
    for (let i = 0; i < candleDummy.length; i++) {
      candleDummy[i] = '-';
    }

    for (let i = 0; i < this.forecastPeriod; i++) {
      this.drawCandlesVariants[2].push(rawData[this.realDataLength + i]);
      this.drawCandlesVariants[1].push(candleDummy);
      this.drawCandlesVariants[0].push(rawData[this.realDataLength + this.forecastPeriod + i]);
    }

    // right padding
    for (let i = 0; i < this.plotPaddingRight; i++) {
      this.drawCandlesVariants[2].push(candleDummy);
      this.drawCandlesVariants[1].push(candleDummy);
      this.drawCandlesVariants[0].push(candleDummy);
    }

  }

  private movingAverage(wnd: number) {
    let result: (number | string)[] = [];
    const currentData = this.drawCandlesVariants[this.predictDirection + 1]; // current data to draw candles: 0 -> dn predict, 1 -> no predict, 2 -> up predict

    let sum = 0;
    for (let i = 0; i < (wnd - 1); i++) {
      result.push('-');
      sum += currentData[i][this.dataPosition];
    }
    sum += currentData[wnd - 1][this.dataPosition];
    result.push((sum / wnd).toFixed(this.pipDecimals));

    let out = 0;
    for (let i = wnd, len = currentData.length; i < len; i++) {
      if (currentData[i][this.dataPosition]) { //for real values only
        sum += (currentData[i][this.dataPosition] - currentData[out][this.dataPosition]);
        result.push((sum / wnd).toFixed(this.pipDecimals));
      } else { // the basic value is absent
        result.push('-')
      }
      out++;
    }
    return result;
  }

  private formAveragesDrawSet(wndList: number[]) {
    let result: any[] = [];
    for (let i = 0; i < wndList.length; i++) {
      let curAve: any = {
        name: 'MA' + wndList[i],
        type: 'line',
        show: false,
        data: this.movingAverage(wndList[i]),
        smooth: true,
        lineStyle: {
          opacity: 0.8,
          width: 2,
        },
        symbol: 'circle',
        symbolSize: 5
      }
      result.push(curAve);
    }
    return result;
  }

  // fill in horizontal line at level
  private horizLine(level: number) {
    let result = [];
    let drawSegmentLength = 10;
    const skip = 2;
    const lng = this.realDataLength + this.forecastPeriod + this.plotPaddingRight;

    for (let i = 0; i < lng / 2; i++) {
      result.push(level);
    }
    let cnt = 0;
    fill:
      while (1) {
        for (let i = 0; i < skip; i++) {
          result.push("-");
          cnt++;
          if (cnt == lng / 2) break fill;
        }
        if (drawSegmentLength > 0) {
          for (let i = 0; i < drawSegmentLength; i++) {
            result.push(level);
            cnt++;
            if (cnt == lng / 2) break fill;
          }
          drawSegmentLength -= skip;
        } else {
          while (cnt < lng / 2) {
            result.push("-");
            cnt++;
          }
          break;
        }
      }

    return result.reverse();
  }

  private setChartOptions() {
    const options: EChartsOption = {
      backgroundColor: this.chartBgColor,
      title: {
        text: "График № " + this.chartNumber + "/" + this.totalNumberOfCharts,
        top: '1%',
        left: '8%',
      },
      tooltip: {
        trigger: 'item',// 'none' - cross & values on the axes, 'axis' - all values for xAxis coord
        axisPointer: {
          type: 'cross'
        },
      },
      legend: {
        height: '5%',
        data: [
          'Data',
          ...this.linesToDraw.map(x => x.name),// add lines names, like averages
        ],
        bottom: 5,
        itemHeight: 7,
        borderColor: 'rgb(6,24,47)',
        borderWidth: .5,
        borderRadius: 5
      },
      grid: {
        top: '8%',
        left: '8%',
        right: '5%',
        bottom: '20%',
        show: true,
      },
      xAxis: {
        type: 'category',
        data: this.categoryData,
        boundaryGap: false,
        axisLine: {onZero: true},
        splitLine: {show: true},
        splitArea: {show: false},
        min: 'dataMin',
        max: 'dataMax',
      },
      yAxis: {
        scale: true,
        splitArea: {show: false},
        position: 'left',
        axisTick: {
          alignWithLabel: true
        },
      },
      dataZoom: [
        {
          type: 'inside', // for zoom inside the plot
          start: 0,
          end: 100
        },
        {
          show: true, // for xoom by the slider outside the plot
          type: 'slider',
          bottom: '7%',
          height: '8%',
          start: 0,
          end: 100,
          handleSize: '75%'
        }
      ],
      visualMap: { // full color for real data and semi-transparent for predicted
        pieces: [
          {
            min: 0,
            max: this.realDataLength - 1,
            opacity: 1
          },
          {
            min: this.realDataLength,
            max: this.realDataLength + this.forecastPeriod,
            opacity: .25
          }
        ],
        dimension: 0, // 0 -> Data series, 1 -> target lines, 2+ -> lines (averages)
        seriesIndex: 0, // relates to candles only
        show: false // legend for visualMap layers
      },
      series: [
        {
          name: 'Data',
          type: 'candlestick',
          data: this.drawCandlesVariants[this.predictDirection + 1], // variants: -1 -> down predict, 0 -> no predict, 1 -> up predict
          itemStyle: {
            color: this.upColor,
            color0: this.downColor,
            borderColor: this.upBorderColor,
            borderColor0: this.downBorderColor
          },
        },
        ...this.linesToDraw, // may include averages and other add lines at the same y-axis
        {
          name: 'Target_UP',
          type: 'line',
          data: this.horizLine(this.upTargetValue),
          symbol: 'none',
          lineStyle: {
            color: this.upTargetColor,
            width: this.targetLineWidth,
            opacity: this.targetLinesOpacity,
            type: 'solid'
          },
          label: {
            show: true, // Show the label
            position: 'insideBottomRight', // Position the label above the data point
            color: '#000', // Label text color
            formatter: '{c}',
            fontStyle: 'normal', // Font style
            //fontWeight: 'bold', // Font weight
            fontFamily: 'Arial', // Font family
            fontSize: 14, // Font size
          },
        },
        {
          name: 'Target_DN',
          type: 'line',
          data: this.horizLine(this.dnTargetValue),
          lineStyle: {
            color: this.dnTargetColor,
            width: this.targetLineWidth,
            opacity: this.targetLinesOpacity,
            type: 'solid'
          },
          label: {
            show: true, // Show the label
            position: 'insideBottomRight', // Position the label above the data point
            color: '#000', // Label text color
            formatter: '{c}',
            fontStyle: 'normal', // Font style
            //fontWeight: 'bold', // Font weight
            fontFamily: 'Arial', // Font family
            fontSize: 14, // Font size
          },
          symbol: 'none'
        },
      ],
    };
    return options;
  }

  @HostListener('window:resize')
  onResize() {
    if (this.myChart) {
      this.myChart.resize();
    }
  }

}
