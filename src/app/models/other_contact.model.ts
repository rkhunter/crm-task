import pick from 'lodash.pick';

export enum OTHER_CONTACT_STATUS {
    PROCESSED = 'PROCESSED',
    NOT_PROCESSED = 'NOT_PROCESSED'
}
export class OtherContact {
    public id: string;
    public personId: string;

    public status: OTHER_CONTACT_STATUS | null | undefined;

    public information: string | null | undefined;
    public isValid: boolean | null | undefined;

    constructor(
        props: { 
            id: string, 
            personId: string,
            status?: OTHER_CONTACT_STATUS | null | undefined,
            information?: string | null | undefined,
            isValid?: boolean | null | undefined
        }
    ) {
        Object.assign(this, pick(props, [`id`, `personId`, `status`, `information`, `isValid`]));
    }
}
