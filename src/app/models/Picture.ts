import { Comment } from './Comment';
import { InspectionDetail } from './InspectionDetail';
import { Rank } from './Rank';

export class Picture {

    id:number | any;

    imageName: string;

    note?: string;

    Comment?: Comment;

    Rank?: Rank;

    InspectionDetail?: InspectionDetail;

}
