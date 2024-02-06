import { Client } from "./Client";
import { ClassDetail } from "./ClassDetail";
import { TeachingMode } from './TeachingMode';
import { PayementType } from './PayementType';
import { Payement } from './Payement';
import { User } from './User';

export class Classes {

    id:number | any;

    number:number | any;

    date: Date;
    
    paiementDate: Date | null;

    invoiceNumber: string;

    address1: string;

    address2: string;

    city: string;

    zip: string;

    state: string;

    milesTravel:number | any;

    timeTravel:number | any;

    mileAmount:number | any;

    createDate: Date;

    modifyDate: Date;

    startDate: Date;

    endDate: Date;
    
    note : string;

    phoneNumber: string;

    emergencyContact: string;

    emergencyPhone: string;

    amount :number | any;

    discount : number = 0;

    meetingUUID : string;

    // No Database
    cc_checkNumber: string;

    // No Database
    ccExpires: Date;

    canceled: boolean = false;

    client: Client = new Client();

    ClassesDetails: ClassDetail[] = new Array<ClassDetail>();

    TeachingMode: TeachingMode = new TeachingMode();

    Payements: Payement[] | null = new Array<Payement>();

    totalCost: number ;

    User : User = new User();

    _mainCourseTitle: string = '';

    get MainCourseTitle(): string{
        return this._mainCourseTitle;
      }
    
      get  ClassTotalCost() : number{
        return this.ClassesDetails.map(cd => cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; }); 
      }


}