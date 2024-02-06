import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callback',
  pure: false
})
export class CallbackPipe implements PipeTransform {
  cached:any;
  resultCached:any;
  transform(items: any[], callback: (item: any) => boolean): any {
    if(items == this.cached && this.resultCached) {
      return this.resultCached;
    }
    if (!items || !callback) {
      this.resultCached = items;
      return this.resultCached;
    }
    this.resultCached = (<Array<any>>items).filter(item => callback(item));
    return this.resultCached;
  }
}