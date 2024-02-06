import { Client } from "./Client";
//import { InvoiceDetails } from "./InvoiceDetails";
import { TypeStudent } from "./TypeStudent";
import { TitleStudent } from "./TitleStudent";

export class Student {

    id:number | any;

    firstName: string;

    lastName: string;

    suffix: string;

    email: string;

    phoneNumber: string;

    stateBoardLicense: string;

    DEA: string;

    isMainProvider: boolean | any;

    newsletter: boolean | any;

    isPrivacySecurityOfficer: boolean | any;

    isOSHACoordinator: boolean | any;

    Client: Client;

    enable: boolean | any;

    TypeStudent: TypeStudent;

    TitleStudent: TitleStudent;

    deserialize(input: any): this {
        return Object.assign(this, input);
      }
    

}
