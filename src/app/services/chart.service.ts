import {candlesData} from '../../../public/candle-chart-data-02';

export class ChartService {

  // dummy - basic candle data with 2 outcomes (up and down), stored consequently
  public getCandlesData() {
    let loadedData = candlesData;

    // removes date if exists for every data set in candlesData
    if (candlesData[0][0][0].toString().includes('/')) {
      loadedData.forEach(cd => cd.forEach((x: string[]) => x.splice(0, 1)));
    }

    return loadedData;
  }
}
