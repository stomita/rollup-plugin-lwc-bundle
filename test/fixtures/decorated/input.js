import { LightningElement, api, wire } from 'lwc';

function getRecord() {
  console.log('hello');
}

export default class MyElement extends LightningElement {
  @api
  recordId;
  
  @track
  records = [];

  @wire(getRecord)
  handleRecords(ret) {
    this.records = ret.data;
  }
}