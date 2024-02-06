import { Rank } from './Rank';
import { Picture } from './Picture';

export class Comment {

    id:number | any;

    name: string;  

    Rank?: Rank;

    Pictures?: Picture[];

}