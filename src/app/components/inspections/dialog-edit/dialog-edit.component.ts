import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InspectionDetail } from '../../../models/InspectionDetail';
import { Picture } from '../../../models/Picture';
import { InspectionService } from '../../../services/inspection.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Comment } from '../../../models/Comment';

export interface EditPicture {
  InspectionDetail: InspectionDetail;
  Picture: Picture;
}

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.css']
})
export class DialogEditComponent implements OnInit {

  commentsFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  filteredComments: ReplaySubject<Comment[]> = new ReplaySubject<Comment[]>(1);

  protected onDestroy = new Subject<void>();

  urlApi : string;

  CommentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEditComponent>,
    private InspectionService: InspectionService,
    @Inject(MAT_DIALOG_DATA) public data: EditPicture
  )
  {
  }

  ngOnInit() {
    this.commentsFilterCtrl.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterComments();
    });
    this.filteredComments.next(this.data.InspectionDetail.Room.Comments.slice());
    this.urlApi = this.InspectionService.urlApi;

    this.CommentForm =  new FormGroup({
      comment: new FormControl(this.data.Picture.Comment.id),
      note: new FormControl(this.data.Picture.note)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  Submit(): void {
    this.dialogRef.close(this.CommentForm.value);
  }

  filterComments(){
    if (!this.data) {
      return;
    }
    // get the search keyword
    let search = this.commentsFilterCtrl.value;
    if (!search) {
      this.filteredComments.next(this.data.InspectionDetail.Room.Comments.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredComments.next(
      this.data.InspectionDetail.Room.Comments.filter(c => c.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
