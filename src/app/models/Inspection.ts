import { Classes } from './Classes';
import { InspectionDetail } from './InspectionDetail';

export class Inspection {

    id:number | any;

    Class: Classes = new Classes();

    InspectionDetails: InspectionDetail[] = new Array<InspectionDetail>();

    createDate: Date = new Date();

}
