'use strict';

export default class Selector {
  constructor({
    dataUrl,
    brand,
    model,
    year,
    list
  }) {
    console.log(dataUrl,
      brand,
      model,
      year,
      list);
    this._loadData(dataUrl, data => {
      this.data = data
    });
  }

  _loadData(url, callback) {
    fetch(url)
      .then(response=> {
        if(response.status == 200) {
          response.json()
        } else {
          throw new ReadError('ошибка получения данных')
        }
      })
      .then(data=> callback(data));
  }


}

