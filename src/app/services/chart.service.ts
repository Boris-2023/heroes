import {candlesData} from '../../../public/candle-chart-data-02';

export class ChartService {

  // dummy - basic candle data with 2 outcomes (up and down), stored consequently
  public getCandlesData() {
    const candlesArray = candlesData;

    // removes date if exists for every data set in candlesData
    if (candlesData[0][0][0].toString().includes('/')) {
      candlesArray.forEach(cd => cd.forEach((x: string[]) => x.splice(0, 1)));
    }

    // process service (last) line from input data
    let predictMoveValues: number[] = [];
    let pipDecimals: number[] = [];
    candlesArray.forEach(cd => {
      const serviceLine = cd.pop(); // eliminates & gets service line
      pipDecimals.push(serviceLine[0]); // saves pip decimals from input data array
      predictMoveValues.push(serviceLine[1] * Math.pow(10, serviceLine[0])); // saves predict expected move value converted to pips
    });

    return {candlesArray, pipDecimals, predictMoveValues};
  }
}
