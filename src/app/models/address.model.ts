import pick from 'lodash.pick';

export enum ADDRESS_STATUS {
    PROCESSED = 'PROCESSED',
    NOT_PROCESSED = 'NOT_PROCESSED'
}
export class Address {
    public id: string;
    public personId: string;

    public streetAddress: string | null | undefined;
    public city: string | null | undefined;
    public region: string | null | undefined;
    public postal: string | null | undefined;
    public country: string | null | undefined;

    public addressStatus: ADDRESS_STATUS | null | undefined;
    public visited: boolean | null | undefined;

    constructor(
        props: { 
            id: string, 
            personId: string,
            streetAddress?: string | null | undefined,
            city?: string | null | undefined,
            region?: string | null | undefined,
            postal?: string | null | undefined,
            country?: string | null | undefined,
            addressStatus?: ADDRESS_STATUS | null | undefined,
            visited?: boolean | null | undefined
        }
    ) {
        Object.assign(this, pick(props, [`id`, `personId`, `streetAddress`, `city`, `region`, `postal`, `country`, `addressStatus`, `visited`]));
    }
}
