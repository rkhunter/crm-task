import pick from 'lodash.pick';

export enum PHONE_STATUS {
    PROCESSED = 'PROCESSED',
    NOT_PROCESSED = 'NOT_PROCESSED'
}
export class Phone {
    public id: string;
    public personId: string;

    public phone: number | null | undefined;

    public phoneStatus: PHONE_STATUS | null | undefined;
    public canBeDialed: boolean | null | undefined;

    constructor(
        props: { 
            id: string, 
            personId: string,
            phone?: number | null | undefined,
            phoneStatus?: PHONE_STATUS | null | undefined,
            canBeDialed?: boolean | null | undefined
        }
    ) {
        Object.assign(this, pick(props, [`id`, `personId`, `phone`, `phoneStatus`, `canBeDialed`]));
    }
}
