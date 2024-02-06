import { Room } from './Room';
import { Inspection } from './Inspection';
import { Picture } from './Picture';

export class InspectionDetail {

    id:number | any;

    roomNumber:number | any;

    roomName: string;

    Inspection: Inspection;

    Room: Room;

    Pictures: Picture[] = new Array<Picture>();
}
