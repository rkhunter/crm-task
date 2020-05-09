import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../models/address.model';
import isNil from 'lodash.isnil';

@Pipe({
  name: 'formatAddress'
})
export class FormatAddressPipe implements PipeTransform {

  transform(address: Address): any {
    const line1 = [address.streetAddress, address.city, address.region].filter(x => !isNil(x)).join(`, `)
    const line2 = [address.postal, address.country].filter(x => !isNil(x)).join(`, `)

    return `${line1}\n${line2}`
  }

}