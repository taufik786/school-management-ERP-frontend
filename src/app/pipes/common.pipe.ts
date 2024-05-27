import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDateTime',
})
export class CommonPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    let type = args[0];
    switch (type) {
      case 'dateTime':
        return new Date(value).toLocaleString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
      default:
        return new Date(value)
          .toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          .split(' ')
          .join('-');
    }
  }
}
