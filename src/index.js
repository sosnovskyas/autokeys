'use strict';
import './style.styl'
import Selector from './components/selector'
new Selector({
  dataUrl: '/data.json',
  brand: document.querySelector('.car-brand'),
  model: document.querySelector('.car-model'),
  year: document.querySelector('.car-year'),
  list: document.querySelector('.key-list')
});
console.log('done');
