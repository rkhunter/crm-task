import pick from 'lodash.pick';

export class Person {
    public id: string;

    public firstName: string;
    public lastName: string;

    constructor(props: { id: string, firstName?: string, lastName?: string}) {
        Object.assign(this, pick(props, [`id`, `firstName`, `lastName`]));
    }
}