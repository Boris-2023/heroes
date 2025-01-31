import {candlesData} from '../../../public/candle-chart-data-02';
import {tickers} from '../../../public/tickers';

export class ChartService {

  // dummy - basic candle data with 2 outcomes (up and down), stored consequently
  public getCandlesData() {
    const candlesArray = candlesData;
    const predictMoveValues: number[] = [];
    const pipDecimals: number[] = [];

    // removes date if exists for every data set in candlesData
    if (candlesArray[0][0][0].toString().includes('/')) {
      candlesArray.forEach(cd => cd.forEach((x: string[]) => x.splice(0, 1)));
    }
    // process service (last) line from input data
    candlesArray.forEach(cd => {
      let serviceLine = cd[cd.length - 1]; // gets service line
      pipDecimals.push(serviceLine[0]); // saves pip decimals from input data array, separately for every chart
      predictMoveValues.push(serviceLine[1]); // saves predict expected move value in units
    });

    return {candlesArray, pipDecimals, predictMoveValues};
  }

  public getTickersAvailable(){
    return tickers;
  }
}
