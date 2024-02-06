import { Component, Inject, OnInit } from '@angular/core';
import { InspectionService } from '../../../services/inspection.service';
import { Room } from '../../../models/Room';
import { Comment } from '../../../models/Comment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.css']
})
export class DialogAddComponent implements OnInit {

  Rooms: Room[];

  Comments: Comment[] = new Array<Comment>();

  note: string;

  constructor(
    public dialogRef: MatDialogRef<DialogAddComponent>,
    private InspectionService: InspectionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.InspectionService.getAllRooms();
    this.InspectionService.Rooms.subscribe(
      rooms => {
        this.Rooms = rooms;
      }
    )
  }

  RoomSelected(room: Room){
    this.Comments = room.Comments;
  }

}
