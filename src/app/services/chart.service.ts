import {candlesData} from '../../../public/candle-chart-data-02';

export class ChartService {

  // dummy - basic candle data with 2 outcomes (up and down), stored consequently
  public getCandlesData() {
    return candlesData;
  }
}
