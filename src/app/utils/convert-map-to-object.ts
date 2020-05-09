export const convertMapToObject = (x: Map<any, any>): Object => Array.from(x).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
}, {});