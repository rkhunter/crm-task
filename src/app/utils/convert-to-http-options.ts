import { HttpParams } from '@angular/common/http';

export const convertToHttpParams = (input: Object) => Object.entries(input).reduce(
    (params, [key, value]) => params.set(key, value),
    new HttpParams()
  )