import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js/min';

@Pipe({
  name: 'prettyPhone'
})
export class PrettyPhoneNumberPipe implements PipeTransform {

  transform(phoneValue: number | string): any {
    try {
      const phoneNumber = parsePhoneNumber(phoneValue + '');
      return `+${phoneNumber.countryCallingCode} ${phoneNumber.formatNational()}`;
    } catch (error) {
      return phoneValue;
    }
  }

}