import { Student } from './Student';
import { ClientType } from './ClientType';
import { Address } from './Address';
import { Classes } from './Classes';

export class Client {

    id:number | any;

    name: string;

    description:string;

    phoneNumber: string;

    cellNumber: string;

    fax: string;

    email: string;
    
    email2: string;

    website: string;

    contactName: string;

    contactEmail: string;

    contactPhoneNumber: string;

    newsletter: boolean | any;

    defaultTravelMilesAmount :number | any;

    enable: boolean

    note: string;

    Students: Student[] = new Array<Student>();

    ClientType: ClientType = new ClientType();

    Addresses: Address[] = new Array<Address>();

    Classes: Classes[] = new Array<Classes>();

    MainAddress : Address = new Address()

    MainProvider: Student =  new Student()

   
}
