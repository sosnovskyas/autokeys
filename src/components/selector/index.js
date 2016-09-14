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
    this._listUpdate(
      /*[{
       "id": "002",
       "img": "002.jpg",
       "desc": "Подробное описание ключа номер два",
       "name": "Ключ номер два",
       "costChip": "123",
       "costPatch": "321",
       "costSharpening": "987",
       "availability": true,
       "expressDelivery": "1",
       "selfDelivery": "1"
       }, {
       "id": "003",
       "img": "003.jpg",
       "desc": "Подробное описание ключа номер три",
       "name": "Ключ номер три",
       "costChip": "123",
       "costPatch": "321",
       "costSharpening": "987",
       "availability": true,
       "expressDelivery": "1",
       "selfDelivery": "1"
       }]*/
    );

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
      list.addEventListener('click', event => {
        if (event.target.closest('button.key__buy')) {
          event.preventDefault();
          this._onBuy(event.target.dataset.id)
        }
        if (event.target.closest('button.buy__order')) {
          event.preventDefault();
          this._onOrder()
        }
      })
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

  _onBuy(id) {
    console.log('_onBuy', id);

    this.list.innerHTML = listTemplate({
      buy: true,
      id: id
    })
  }

  _onOrder() {
    console.log('_onOrder');

    const name = this.list.querySelector('.buy__name').value;
    const phone = this.list.querySelector('.buy__phone').value;
    const comment = this.list.querySelector('.buy__comment').value;
    const id = this.list.querySelector('.buy__id').value;
    console.log(name, phone, comment, id);
    /*
     fetch('/buy.php', {
     method: 'POST',
     body: {
     id: id,
     name: name,
     phone: phone,
     comment: comment,
     qwe: 'qwe'
     }
     })
     .then(response=> {
     if (response.status == 200) {
     console.log('response', response);
     return response
     } else {
     throw new Error('ошибка получения данных')
     }
     })
     .then(data=> console.log(data))
     .catch((error) => {
     console.error(error.message);
     });

     */

    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'buy.php');

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(`name=${name}&id=${id}&phone=${phone}&comment=${comment}`);

    xhr.onreadystatechange = function () {
      if (this.readyState != 4) return;

      // по окончании запроса доступны:
      // status, statusText
      // responseText, responseXML (при content-type: text/xml)

      if (this.status != 200) {
        // обработать ошибку
        alert('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
        return;
      } else {
        console.log('status', this.status, 'request', this.responseText)
      }

      // получить результат из this.responseText или this.responseXML
    }
  }
}

