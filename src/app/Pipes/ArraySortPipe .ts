import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortASC",
  pure: false
})
export class ArraySortPipeASC  implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return null;
    }
    array.sort((a: any, b: any) => {
      if(a[field] == undefined || a[field] == null ){
        return 1;
      }
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
      return 0;
    });
    return array;
  }
}

@Pipe({
    name: "sortDESC",
    pure: false
  })
  export class ArraySortPipeDESC  implements PipeTransform {
    transform(array: any, field: string): any[] {
      if (!Array.isArray(array)) {
        return null;
      }
      array.sort((a: any, b: any) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      });
      return array;
    }
  }

  @Pipe({
    name: 'sortByDate',
    pure: false
  })
  export class SortByDatePipe implements PipeTransform {
    transform(value: any, field: string): any {
      const sortedValues = value.sort((a, b) => new Date( b[field]).getTime() - new Date(a[field]).getTime());
      return sortedValues;
    }
  }

  @Pipe({
    name: 'callback',
    pure: false
  })
  export class CallbackPipe implements PipeTransform {
      transform(items: any[], callback: (item: any) => boolean): any {
          if (!items || !callback) {
              return items;
          }
          return items.filter(item => callback(item));
      }
  }
