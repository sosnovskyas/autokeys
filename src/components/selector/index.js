'use strict';
import selectTemplate from './select.jade'
import listTemplate from './list.jade'

export default class Selector {
  constructor({
    dataUrl,
    brand,
    model,
    year,
    list
  }) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.list = list;

    // empty list
    this._listUpdate([
      {
        "id": "000002",
        "img": "2.jpg",
        "desc": "description 2",
        "name": "name 2",
        "costChip": "123",
        "costPatch": "321",
        "costSharpening": "987",
        "availability": true,
        "expressDelivery": "1",
        "selfDelivery": "1"
      }, {
        "img": "2.jpg",
        "desc": "description 4",
        "name": "name 4",
        "costChip": "123",
        "costPatch": "321",
        "costSharpening": "987",
        "availability": false,
        "expressDelivery": "1",
        "selfDelivery": "1"
      }]);

    this._loadData(dataUrl, data => {
      this.data = data;
      let brandList = [];

      for (let item in this.data.cars) {
        brandList.push(item);
      }

      this._updateSelect(brand, brandList, 'Выберите марку');
      brand.addEventListener('change', event => this._onBrandChange(event.target.value));
      model.addEventListener('change', event => this._onModelChange(event.target.value));
      year.addEventListener('change', event => this._onYearChange(event.target.value));
    });
  }

  _loadData(url, callback) {
    fetch(url)
      .then(response=> {
        if (response.status == 200) {
          return response.json()
        } else {
          throw new Error('ошибка получения данных')
        }
      })
      .then(data=> callback(data));
  }

  _updateSelect(elem, data, defaultValue) {
    elem.innerHTML = selectTemplate({
      items: data,
      defaultValue: defaultValue
    });
  }

  _listUpdate(items) {
    console.log('_listUpdate', JSON.stringify(items));
    const empty = !items;
    this.list.innerHTML = listTemplate({
      items: items,
      empty: empty
    })
  }

  _onBrandChange(item) {
    console.log('_onBrandChange', item);
    this._updateSelect(this.year, [], 'Выберите год');
    let modelList = [];

    for (let model in this.data.cars[item]) {
      modelList.push(model);
    }
    this._updateSelect(this.model, modelList, 'Выберите модель');
  }

  _onModelChange(item) {
    console.log('_onModleChange', item);
    let yearList = [];
    for (let year in this.data.cars[this.brand.value][item]) {
      yearList.push(year);
    }
    this._updateSelect(this.year, yearList, 'Выберите год');
  }

  _onYearChange(item) {
    console.log('_onYearChange', item);

    const keyList = this.data.cars[this.brand.value][this.model.value][this.year.value];
    let keyItems = [];

    keyList.map(item => keyItems.push(this.data.keys[item]));

    this._listUpdate(keyItems);
  }

}

