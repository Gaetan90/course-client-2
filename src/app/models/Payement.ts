import { PayementType } from './PayementType';
import { Classes } from './Classes';

export class Payement {

    id:number | any;

    paiementNumber: string;

    paiementDate: Date;

    note: string;

    amount :number | any;

    PayementType: PayementType;
    
    Class: Classes;

    cc_checkNumber: string;

    ccExpires: Date;
   
}