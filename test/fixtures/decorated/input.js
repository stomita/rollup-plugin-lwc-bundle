import { LightningElement, api, wire } from 'lwc';

export default class MyElement extends LightningElement {
  @api
  recordId;
  
  @track
  records = [];

  @wire()
  handleRecords(ret) {
    this.records = ret.data;
  }
}