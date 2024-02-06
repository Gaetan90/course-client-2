import { InspectionDetail } from './InspectionDetail';
import { Comment } from './Comment';

export class Room {

    id: string;

    name: string;

    InspectionDetails?: InspectionDetail[] = new Array<InspectionDetail>();

    Comments: Comment[] = new Array<Comment>();

}
