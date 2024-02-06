import { Injectable, ElementRef } from '@angular/core';
import { Inspection } from '../models/Inspection';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


import { UserOptions } from 'jspdf-autotable';
import { Room } from '../models/Room';
import jsPDF from 'jspdf';

interface jsPDFWithPlugin extends jsPDF{
  autoTable : (options : UserOptions) => jsPDF;
}

@Injectable({
  providedIn: 'root'
})
export class InspectionService {


  urlApi: string;

  Inspections : Inspection[] = new Array<Inspection>();

  InspectionsSubject = new Subject<Inspection[]>();

  Rooms = new Subject<Room[]>();

  pourcentage :number | any;

  PourcentageSubject = new Subject<number>();

  constructor(
    private httpClient : HttpClient
  ) {
    this.urlApi = "https://cloudapi.msdssafety.com:3000";
    this.pourcentage = 0;
   }

  emitInspectionsSubject(){
    this.InspectionsSubject.next(this.Inspections.slice())
  }
  emitPourcentageSubject(){
    this.PourcentageSubject.next(this.pourcentage)
  }

  getAllInspections(){
    this.httpClient
    .get<Inspection[]>(this.urlApi + '/inspections')
    .subscribe(
        (response) => {
          console.log(response)
            this.Inspections = response
            this.emitInspectionsSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }
  getAllRooms(){
    this.httpClient
    .get<Room[]>(this.urlApi + '/rooms')
    .subscribe(
      (rooms) => {
        this.Rooms.next(rooms.slice());
      },
      (error) => {
          console.log(error)
      }
    )
  }
  exportInspectionPdf2( Inspection: Inspection){
      let doc = new jsPDF('p','mm' ,'a4') as jsPDFWithPlugin;
      Inspection.InspectionDetails.forEach(InspectionDetail => {
        doc.autoTable({
          html: '#table-1-' + InspectionDetail.id,
        });
        doc.autoTable({
          html: '#table-2-' + InspectionDetail.id,
          didDrawCell: function(data) {
            // if (data.cell.section === 'body') {
            //   var td = data.cell.raw;
            //   // Assuming the td cells have an img element with a data url set (<td><img src="data:image/jpeg;base64,/9j/4AAQ..."></td>)
            //   var img = td.getElementsByTagName('img')[0];
            //   var dim = data.cell.height - data.cell.padding('vertical');
            //   var textPos = data.cell.textPos;
            //   doc.addImage(img, textPos.x,  textPos.y, dim, dim);
            // }
          }
        });
      });
      doc.save('test')
  }

  exportInspectionPdf( Inspection: Inspection){

    return new Promise<void>(resolve => {
      let doc = new jsPDF('p','mm' ,'a4') as jsPDFWithPlugin;
      let nbDone = 0;
      let nbPictures = Inspection.InspectionDetails.reduce((subtotal, item) => subtotal + item.Pictures.length, 0)
      console.log('nbPictures')
      console.log(nbPictures)
      let docWidth =  Number(doc.internal.pageSize.getWidth().toPrecision(2));
      let head = [[ {content : 'Comment', styles: {cellWidth : 67}}, {content : 'Picture', styles: {cellWidth : 41}} , {content : 'G', styles: {cellWidth : 7 ,textColor : '#28a745'}}, {content : 'M', styles: {cellWidth : 7, textColor : '#ffc107' }}, {content : 'D', styles: {cellWidth : 7,textColor : '#dc3545'}}, {content : 'Note', styles: {cellWidth : 67}}]];
      let body = new Array<any>();
      let options : UserOptions;
      let imgURL = new Array<any>();
      Inspection.InspectionDetails.forEach(InspectionDetail => {
        //doc.setFontSize(32);
        //doc.text(InspectionDetail.Room.name + ' #' + InspectionDetail.roomNumber, 10 , 10, {maxWidth: (docWidth - 10).toString() })
        let y = 20;
        body.push(
          [ { content: InspectionDetail.Room.name + ' #' + InspectionDetail.roomNumber, colSpan: 6, styles: {fontStyle : 'bold', fillColor : '#d9d9d9'}}]
        )
        imgURL.push(null)
        console.log(body);
        InspectionDetail.Pictures.forEach(Picture => {
          let row = new Array<any>();
          row.push(Picture.Comment.name);
          row.push('');
          imgURL.push(Picture.imageName)

          switch(Picture.Rank.id){
            case 1 :
              row.push({content : 'X', styles: {fontStyle : 'bold',textColor : '#28a745'}})
              row.push('')
              row.push('')
            break;
            case 2 :
              row.push('')
              row.push({content : 'X', styles: {fontStyle : 'bold', textColor : '#ffc107'}})
              row.push('')
            break;
            case 3 :
              row.push('')
              row.push('')
              row.push({content : 'X', styles: {fontStyle : 'bold',textColor : '#dc3545'}})
            break;
          }
          row.push({content : (Picture.note??'')})
          body.push(row)
        });
      });
      options  = { body: body, head: head}
     doc.autoTable({
      body: body,
      head: head,
      bodyStyles:{
        fontSize:8
      },
      headStyles:{
        halign : 'center'
      },
      margin: {
        top:7,
        left: 7,
        right:7
      },
      didDrawCell : (data) => {
        console.log('data.row.index')
        if (data.column.index === 1 && imgURL[data.row.index] != null) {
          console.log('data.row.index2')
          console.log(data.row.index)
          // Assuming the td cells have an img element with a data url set (<td><img src="data:image/jpeg;base64,/9j/4AAQ..."></td>)
          var img = new Image()
          img.src = this.urlApi + '/' + imgURL[data.row.index];
          console.warn('img')
          console.log(img)
          let canvas = this.image2Canvas(img)
          //img.src = canvas.toDataURL("image/jpeg", .2);

         // data.row.height = data.row.height < 30 ?30: data.row.height;
          let imgWidth = Number(data.cell.width.toPrecision(2)) /1.1;
          if(img.width > img.height){
            data.row.height = data.row.height < 32 ?32: data.row.height;
          }
          else{
            data.row.height = data.row.height < 52 ?52: data.row.height;
          }
          data.cell.width = imgWidth+10;
          let propWidth = Number(((img.width - imgWidth)/imgWidth).toPrecision(2));
          let imgHeight = img.height / propWidth;
          var dim = data.cell.height - data.cell.padding('vertical');
          var textPos = data.cell.getTextPos();
          console.log('img.src')
          console.log(img.src)
          console.log('canvas')
          console.log(this.image2Canvas(img))
          doc.addImage(img , 'jpeg', textPos.x,  textPos.y, imgWidth ,imgHeight , undefined,'FAST');
          console.log('textPos.x2')
        }
      }
     })
      doc.addPage()
      Inspection.InspectionDetails.forEach(InspectionDetail => {
        doc.setFontSize(32);
        doc.text(InspectionDetail.Room.name + ' #' + InspectionDetail.roomNumber, 10 , 10, {maxWidth: (docWidth - 10) })
        let y = 20;
        InspectionDetail.Pictures.forEach(Picture => {

          var img = new Image()
          img.src = this.urlApi + '/' + Picture.imageName;
          console.log('IMG1'+ nbDone)
          let imgWidth = 0;
          if(img.width > img.height){
            imgWidth = Number(docWidth.toPrecision(2)) / 3;
          }
          else{
            imgWidth = Number(docWidth.toPrecision(2)) / 6;
          }
          let propWidth = Number(((img.width - imgWidth)/imgWidth).toPrecision(2));
          let imgHeight = img.height / propWidth;
          if (y + imgHeight > (doc.internal.pageSize.getHeight() - 10)) {
            doc.addPage();
            y = 10;
        }
        console.log(img)
        if(img != null){
          doc.addImage(img, 'jpeg', 10, y, imgWidth, imgHeight , undefined,'FAST')
          doc.setFontSize(10);
          let color = '#000'
          switch(Picture.Rank.id){
            case 1:
              color = '#28a745';
              break;
            case 2:
              color = '#ffc107';
              break;
            case 3:
              color = '#dc3545';
              break;
            default:
              color = 'black'
              break;
          }
          doc.setTextColor(color)
          doc.text(Picture.Comment.name, 10 , imgHeight + y + 5, {maxWidth: (docWidth - 20)} )
          doc.setTextColor('black')
          if (y + imgHeight > (doc.internal.pageSize.getHeight() - 10)) {
            doc.addPage();
            y = 10;
        }
          let h =  Number((doc.getStringUnitWidth(Picture.Comment.name) / (docWidth - 20)).toPrecision(1));
          if (y + imgHeight > (doc.internal.pageSize.getHeight() - 10)) {
            doc.addPage();
            y = 10;
        }
          if(Picture.note != null){
            doc.text("Note: " + Picture.note, 10 , imgHeight + y + 10 + (10*h), {maxWidth: (docWidth - 10)} )
          }

          y = imgHeight + y + 15;
        }
        nbDone++;
        this.pourcentage = Number((nbDone/nbPictures*100).toPrecision(2));
        this.emitPourcentageSubject();
        console.log('this.pourcentage')
        console.log(this.pourcentage)
        });
        doc.addPage();
      });
      doc.save('test')
      resolve();
    });
  }

  saveInspection(InspectionSelected: Inspection) {
    return this.httpClient.post(this.urlApi + '/saveInspection', InspectionSelected).toPromise().then(res =>  res);
  }

  image2Canvas(image : HTMLImageElement) : HTMLCanvasElement {
		var canvas = document.createElement("canvas") as HTMLCanvasElement;
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext("2d").drawImage(image, 0, 0);
		return canvas;
	}

}
