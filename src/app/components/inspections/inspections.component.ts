import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';
//const { jsPDF } = require("jspdf"); // will automatically load the node version

import { UserOptions } from 'jspdf-autotable';
import { Inspection } from '../../models/Inspection';
import { InspectionDetail } from '../../models/InspectionDetail';
import { LoaderService } from '../../services/loader.service';
import { InspectionService } from '../../services/inspection.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.component.html',
  styleUrls: ['./inspections.component.css']
})
export class InspectionsComponent implements OnInit {

  InspectionsSubscription : Subscription;

  Inspections : Inspection[];

  @ViewChild('inspectionSelectList') InspectionSelectList: MatSelectionList;

  InspectionSelected : Inspection= new Inspection();

  urlApi: string;

  @ViewChild('inspectionDetail') InspectionDetail: ElementRef;

  loading: boolean = false;

  pourcentage:number;

  PercentageSubscription : Subscription;


  InspectionDetailWithoutPicture: Array<InspectionDetail>;

  constructor(
    private InspectionService : InspectionService,
    private elRef:ElementRef,
    private renderer: Renderer2,
    private loaderService: LoaderService,
    public dialog: MatDialog
  ) {
    this.InspectionSelected  = new Inspection();
    this.pourcentage = 0;
    this.InspectionDetailWithoutPicture = new Array<InspectionDetail>()
   }

  ngOnInit(): void {
    this.urlApi = this.InspectionService.urlApi;
    this.InspectionService.getAllInspections();
    this.InspectionsSubscription = this.InspectionService.InspectionsSubject.subscribe(
      (Inspections : Inspection[]) => {
        this.Inspections = Inspections;
        this.InspectionDetailWithoutPicture = new Array<InspectionDetail>()
        this.InspectionSelected = Inspections.sort((a, b) => new Date( b['createDate']).getTime() - new Date(a['createDate']).getTime())[0]??new Inspection();
        if(this.InspectionSelected != undefined){
          this.InspectionSelected.InspectionDetails = this.InspectionSelected.InspectionDetails.sort((a, b) => a.Room.name.localeCompare(b.Room.name))
          this.InspectionSelected.InspectionDetails = this.InspectionSelected.InspectionDetails.sort((a, b) => {
            if (a.Room.name === b.Room.name) {
              // Price is only important when cities are the same
              return a.roomNumber - b.roomNumber;
           }
           return null;
          })
         // this.InspectionSelected.Class.client.MainProvider = this.InspectionSelected != undefined? this.InspectionSelected.Class.client.Students.find(s => s.isMainProvider): new Student();

        }
      }
    )
    this.InspectionService.emitInspectionsSubject();
    this.PercentageSubscription = this.InspectionService.PourcentageSubject.subscribe(
      (percentage : number) => {
        this.pourcentage = percentage;
      }
    )
    this.InspectionService.emitPourcentageSubject();
    this.pourcentage = this.InspectionService.pourcentage;
  }

  ngAfterViewInit() {
    this.InspectionSelectList.selectionChange.subscribe((s: MatSelectionListChange) => {
      this.InspectionSelected = this.InspectionSelectList.selectedOptions.selected[0].value;
      this.InspectionSelected.InspectionDetails = this.InspectionSelected.InspectionDetails.sort((a, b) => a.Room.name.localeCompare(b.Room.name))
      //this.InspectionSelected.Class.client.MainProvider = this.InspectionSelected != undefined? this.InspectionSelected.Class.client.Students.find(s => s.isMainProvider): new Student();
      this.InspectionDetailWithoutPicture = new Array<InspectionDetail>()
    });
  }
  exportInspectionPdf3(){
    // var pdf = new jsPDF('p', 'pt', 'letter');
    // pdf.addHTML(document.getElementById('InspectionPage')[0], function () {
    //     pdf.save('Test.pdf');
    // });
  }

  async exportInspectionPdf2(){
    // let TOF : Array<any> = new Array<{title:string, page:number, y:number}>()
    // let doc = new jsPDF('p','mm' ,'a4',.2);
    // let width = doc.internal.pageSize.getWidth();
    // let height = doc.internal.pageSize.getHeight();
    // doc.setFillColor('#066472');
    // doc.rect(10, 15, 190, 2, "F");
    // doc.setFontSize(10)
    // doc.setFontType("bold");
    // doc.text("Prepared for Exclusive Use by:", width/2, 35, 'center');
    // doc.setFontType("normal");
    // doc.text(this.InspectionSelected.Class.client.name, width/2, 40, 'center');
    // doc.setFontType("bold");
    // doc.text("Address of Property: ", width/2, 50, 'center');
    // doc.setFontType("normal");
    // doc.text(this.InspectionSelected.Class.address1 + "\n" + this.InspectionSelected.Class.city + " " + this.InspectionSelected.Class.state + " " + this.InspectionSelected.Class.zip, width/2, 55, 'center');
    // doc.setFontType("bold");
    // doc.text("Date of Service:", width/2, 69, 'center');
    // doc.setFontType("normal");
    // doc.text(new Date(this.InspectionSelected.Class.startDate).toLocaleDateString('en-US'), width/2, 74, 'center');
    // doc.setFontType("bold");
    // doc.text("Company Providing Service:", width/2, 84, 'center');
    // doc.setFontType("normal");
    // doc.text('Medical Safety Developmental Services.\nLinda L. Cannon \nDirector of Safety Compliance  ', width/2, 90, 'center');
    // doc.setFontType("normal");
    // doc.text('1001 Land of Promise Rd \nChesapeake, VA 23322 \nPhone: (757) 718-1515 \nFax: (800) 483-0223 \nEmail: MSDS@cox.net', width/2, 110, 'center');
    // doc.addPage();
    // let y = 0;
    //   this.InspectionSelected.InspectionDetails.forEach(InspectionDetail => {
    //     y++;
    //     let title:string;
    //     if(InspectionDetail.roomName != null){
    //       title = InspectionDetail.roomName;
    //     }
    //     else{
    //       title = InspectionDetail.Room.name + (this.InspectionSelected.InspectionDetails.filter(id => id.Room.id ==  InspectionDetail.Room.id).length > 1?" #" + InspectionDetail.roomNumber:"" );
    //     }
    //     TOF.push({
    //       page: doc.getNumberOfPages() + 1,
    //       title : title,
    //       y:y
    //     });
    //     doc.setFillColor('#066472');
    //     doc.rect(10, 19, 190, 7, "F");
    //     doc.setFontSize(10)
    //     doc.setFontType("bold");
    //     doc.setTextColor(255,255,255)
    //     doc.text(15, 24, y + '. ' + title)
    //     doc.setTextColor(0,0,0)

    //     var elem = document.getElementById('table-1-' + InspectionDetail.id);
    //     var res = doc.autoTableHtmlToJson(elem);
    //     res.columns.pop();
    //     res.data.forEach(element => {
    //       element.pop()

    //     });
    //     console.log(res)
    //     doc.autoTable(res.columns, res.data, {
    //       theme: 'plain',
    //       startY: 30,
    //       styles: {lineColor: [0, 0, 0], lineWidth: .2, textAligne: 'center'},
    //       headStyles: {halign: 'center', fontSize: 8, cellPadding: {top: .5, right: .1, bottom: .5, left: .1}, lineColor: '#fff'},
    //       columnStyles: {
    //         0: {halign: 'center', fillColor : '#64b4af', cellWidth : 6},
    //         1: {halign: 'center', fillColor : '#64b4af', cellWidth : 6},
    //         2: {halign: 'center', fillColor : '#64b4af', cellWidth : 6},
    //         3: {halign: 'center', fillColor : '#64b4af', cellWidth : 6},
    //         4: {cellWidth : 160},
    //       },
    //       didParseCell(data) {
    //         let td : HTMLTableCellElement =  data.cell.raw;
    //         if(td.textContent == 'X'){
    //           data.cell.styles.fillColor = '#066472'
    //         }
    //       },
    //     });
    //     // doc.autoTable({
    //     //   html: '#table-1-' + InspectionDetail.id,


    //     // });
    //     let finalY = doc.previousAutoTable.finalY; // The y position on the page
    //     doc.setFontSize(6)
    //     doc.setFontType("normal")
    //     doc.text(20, finalY + 4, "S: Satisfactory - F: Fair - P/D: Poor/Defective - N/A: Not Applicable")
    //     doc.autoTable({
    //       html: '#table-2-' + InspectionDetail.id,
    //       theme: 'plain',
    //       styles:{
    //         minCellHeight: 65,
    //         minCellWidth: 60,
    //         overflow: 'linebreak',
    //         fontSize:9,

    //       },
    //       columnStyles: {
    //         cellWidth: 'auto',
    //       },
    //       rowPageBreak: 'avoid',
    //       didDrawCell: function(data) {
    //         if (data.cell.section === 'body') {
    //           let td : HTMLTableCellElement =  data.cell.raw;
    //           data.cell.width = 60
    //           if(td != undefined){
    //             // Assuming the td cells have an img element with a data url set (<td><img src="data:image/jpeg;base64,/9j/4AAQ..."></td>)
    //             var img =  td.getElementsByTagName('img')[0];
    //             var dim = 58;
    //             var textPos = data.cell.getTextPos();
    //             if(img != undefined){
    //               doc.addImage(img, textPos.x,  textPos.y+5, dim, dim);
    //             }
    //           }
    //         }
    //       },
    //     });
    //     if(y <this.InspectionSelected.InspectionDetails.length){

    //       doc.addPage()
    //     }

    //   });
    //   doc.insertPage(2)
    //   doc.setPage(2)
    //   doc.setFillColor('#066472');
    //   doc.rect(10, 19, 190, 7, "F");
    //   doc.setFontSize(10)
    //   doc.setFontType("bold");
    //   doc.setTextColor(255,255,255)
    //   doc.text(15, 24, "Table of Content")

    //   doc.setTextColor(100,180,175)
    //   doc.setFontType("normal");
    //   let t = 'Cover Page '
    //   let w = doc.getTextWidth(t);
    //   for(let i = 1; i <= 169-parseInt(w, 10); i++){
    //     t += '.'
    //   }
    //   doc.textWithLink( t, 12, 32 , { pageNumber: 1});
    //   doc.text(180, 32, '1', 'left' )
    //   t = 'Table of Content '
    //   w = doc.getTextWidth(t);
    //   for(let i = 1; i <= 169-parseInt(w, 10); i++){
    //     t += '.'
    //   }
    //   doc.textWithLink( t, 12, 37 , { pageNumber: 2});
    //   doc.text(180, 37, '2', 'left' )
    //   let z = 10;
    //   TOF.forEach(o => {
    //     t = o.y.toString() + '. ' + o.title + ' '
    //     w = doc.getTextWidth(t);
    //     for(let i = 1; i <= 169-parseInt(w, 10); i++){
    //       t += '.'
    //     }
    //     doc.textWithLink(t, 12, 32 + z, { pageNumber: o.page});
    //     doc.text(180, 32 + z, o.page.toString(), 'left' )
    //     z = z + 5;
    //   })

    //   doc.setTextColor('#000');
    //   let dataMSDSLogo = '';
    //   await this.getBase64ImageFromURL('assets/img/logo-msdssafety2.png').subscribe((data2:string) => {
    //     dataMSDSLogo = data2;
    //     doc.setFontSize(7)
    //     for(let i = 1; i <= doc.internal.getNumberOfPages(); i++){
    //       doc.setPage(i);
    //       doc.addImage(dataMSDSLogo,  5 , 2 , 36, 12)
    //       doc.setFontSize(10)
    //       doc.text(200,12, 'Report #' + this.InspectionSelected.Class.number,'right');
    //       doc.setFontSize(7)
    //       doc.text(12,290, 'MSDS - Medical Safety Developmental Services'); //print number bottom right
    //       doc.text(180,290, 'Page ' + i + " of " + doc.internal.getNumberOfPages()); //print number bottom right
    //     }
    //     doc.save('Report#' + this.InspectionSelected.Class.number + '.pdf')
    //   })

  }

  exportInspectionPdf(){
    this.loaderService.isLoading.next(true);
    this.loaderService.message.next('Loading time depends on the number of images in the report!');
    setTimeout(()=>{
      this.InspectionService.exportInspectionPdf(this.InspectionSelected).then(
        () => {
          this.loaderService.isLoading.next(false);
          this.loaderService.message.next(null);
          console.log("Task Complete!")
        },
        () => {
          this.loaderService.isLoading.next(false);
          this.loaderService.message.next(null);
          console.log("Task Errored!");
        }
      )
      }, 500
    )
  }

  onFocus(event, id){
    this.renderer.setStyle(this.elRef.nativeElement.querySelector('.Edit-' + id), 'display', 'block');
    this.renderer.setStyle(event.originalTarget, 'background-color', '#f0f0f0' )
  }

  outFocus(event,id){
    this.renderer.setStyle(this.elRef.nativeElement.querySelector('.Edit-' + id), 'display', 'none');
    this.renderer.setStyle(event.originalTarget, 'background-color', '#fff' )
  }

  editPicture(idInspectionDetails, idPicture){
    const dialogRef = this.dialog.open(DialogEditComponent, {
      width: '40%',
      position: {top: '10px'},
      data:
      {
        'InspectionDetail': this.InspectionSelected.InspectionDetails.find(id => id.id == idInspectionDetails),
        'Picture': this.InspectionSelected.InspectionDetails.find(id => id.id == idInspectionDetails).Pictures.find(p => p.id == idPicture)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result != null){
        this.InspectionSelected.InspectionDetails.find(id => id.id == idInspectionDetails).Pictures.find(p => p.id == idPicture).Comment =
        this.InspectionSelected.InspectionDetails.find(id => id.id == idInspectionDetails).Room.Comments.find(c => c.id == result.comment);
        this.InspectionSelected.InspectionDetails.find(id => id.id == idInspectionDetails).Pictures.find(p => p.id == idPicture).note = result.note;
        this.InspectionService.saveInspection(this.InspectionSelected).then((res) => {

        });
      }

    });
  }

  createRange(InspectionDetail : InspectionDetail){
    let Id = Object.assign({}, InspectionDetail);
    Id.Pictures =  InspectionDetail.Pictures.filter(p => p.imageName != null)
    this.InspectionDetailWithoutPicture.push(Id);
    var items: number[] = [];
    for(var i = 0; i <= Id.Pictures.length; i++){
       items.push(i);
       i++;
       i++;
    }
    return items;
  }

  onPrint(){
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write(document.getElementById("InspectionPage").innerHTML);

    // mywindow.print();
    // mywindow.close();

    return true;
  }

  getBase64ImageFromURL(url: string)  {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
      img.onerror = (err) => {
        observer.error(err);
      };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
    }
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      // This will draw image
      ctx.drawImage(img, 0, 0);
      // Convert the drawn image to Data URL
      var dataURL = canvas.toDataURL("image/jpeg");
      return dataURL;
      }
}
