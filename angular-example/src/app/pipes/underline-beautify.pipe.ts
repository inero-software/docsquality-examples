import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'underlineBeautify'
})
export class UnderlineBeautifyPipe implements PipeTransform {

  transform(value: string): any {
    const separated = value.replace(/[_]/g, ' ').split(' ');
    separated.forEach((part, index, theArray) => {
      theArray[index] = this.convertFirstCharacterToUpperCase(part);
    })
    return separated.join(' ');
  }

  convertFirstCharacterToUpperCase(value) {
    let result = value.split('');
    result[0] = result[0].toUpperCase();
    return result.join('');
  }
}
