import { Course } from '../models/Course';
import { Injectable, OnInit } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client } from '../models/Client';
import { retry } from 'rxjs/operators';
import { CourseCategory } from '../models/CourseCategory';
import { TeachingMode } from '../models/TeachingMode';
import { Classes } from '../models/Classes';
import { Address } from '../models/Address';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Student } from '../models/Student';
import { ClassDetail } from '../models/ClassDetail';
import jsPDF, { TextOptionsLight } from 'jspdf';
import { UserOptions } from 'jspdf-autotable';
import autoTable from 'jspdf-autotable'


export interface Travel {
  miles:number | any;
  duration:number | any;
}
interface jsPDFWithPlugin extends jsPDF{
  autoTable : (options : UserOptions) => jsPDF;
}

@Injectable()
export class CourseService{


  key: string = 'AslvLXPYrwYzEomPFRdIOYKg6j2ntjR6a3N9Ncr2-dI9NOW_XNpOoXZIQJJxsPG8';

  urlApi: string;

  CourseListSubject = new Subject<Course[]>();

  CourseSubject = new Subject<Course>();

  Courses : Course[]=[];

  Course : Course= new Course();

  CourseCategories : CourseCategory[]=[];

  CourseCategoriesSubject = new Subject<CourseCategory[]>();

  TeachingModes : TeachingMode[]=[];

  TeachingModesSubject = new Subject<TeachingMode[]>();

  Classes : Classes[]=[];

  Class : Classes= new Classes();

  ClassesSubject = new Subject<Classes[]>();

  ClassSubject = new Subject<Classes>();


  constructor(
    private httpClient : HttpClient
    ){

      this.urlApi = "https://cloudapi.msdssafety.com:3000";
  }

  emitCourseListSubject(){
    this.CourseListSubject.next(this.Courses.slice())
  }

  emitCourseSubject(){
    this.CourseSubject.next(this.Course)
  }

  emitCourseCategoriesSubject(){
    this.CourseCategoriesSubject.next(this.CourseCategories.slice())
  }

  emitTeachingModesSubject(){
    this.TeachingModesSubject.next(this.TeachingModes.slice())
  }

  emitClassesSubject(){
    this.ClassesSubject.next(this.Classes.slice())
  }

  emitClassSubject(){
    this.ClassSubject.next(this.Class)
  }

  getAllCourses(){
    this.httpClient
    .get<Course[]>(this.urlApi + '/courses')
    .subscribe(
        (response) => {
            this.Courses = response;
            this.emitCourseListSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  getAllClasses(startDate = null, endDate = null){
    let params = new HttpParams();
    params = params.append('startDate', startDate);
    params = params.append('endDate', endDate);
    this.httpClient
    .get<Classes[]>(this.urlApi + '/classes', { params: params })
    .subscribe(
        (response) => {
            this.Classes = response.filter(c => c.canceled == false);
            console.log(this.Classes)
            this.Classes.forEach(c => {
              if(c.ClassesDetails.length > 0){
                c.totalCost = c.ClassesDetails.map(cd => cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; });
              }
              else{
                c.totalCost = 0;
              }

            })
            this.emitClassesSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  getCourseCategories(){
    this.httpClient
    .get<CourseCategory[]>(this.urlApi + '/coursecategories')
    .subscribe(
        (response) => {
            this.CourseCategories = response;
            this.emitCourseCategoriesSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  getTeachingModes(){
    this.httpClient
    .get<TeachingMode[]>(this.urlApi + '/teachingmodes')
    .subscribe(
        (response) => {
            this.TeachingModes = response;
            this.emitTeachingModesSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  addCourse(Course: Course) {
    return this.httpClient.post(this.urlApi + '/addcourse', Course).toPromise().then(res =>  null);
  }

  getClass(id : number){
    this.httpClient
    .get<Classes>(this.urlApi + '/class/'+id)
    .subscribe(
        (response) => {
            this.Class = response;
            this.Class.client.MainAddress = this.Class.client.Addresses.length  == 0?new Address(): this.Class.client.Addresses.find(a => a.isMain === true);
            this.Class.totalCost = this.Class.ClassesDetails.map(cd => cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; });
            this.emitClassSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  addClass(classes: Classes) {
    return this.httpClient.post(this.urlApi + '/addclass', classes).toPromise().then(res =>  null);
  }

  updateClass(classes: Classes) {
    return this.httpClient.put(this.urlApi + '/updateclass/'+classes.id, classes).toPromise().then(res =>  res);
  }

  deleteClass(id: number) {
    return this.httpClient.delete(this.urlApi + '/deleteclass/'+id).toPromise().then(res =>  null);
  }

  updateCourse(Course: Course) {
    return this.httpClient.put(this.urlApi + '/updatecourse/'+Course.id, Course).toPromise().then(res =>  res);
  }



  getTravel(a : Address){
   return this.httpClient
    .get('https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=907 Land of Promise Rd Chesapeake VA&wp.1='+a.address1 +' '+ a.city + ' ' + a.state + '&key=' + this.key).toPromise();

  }

  GeneratePDFCertificate(CertName:string) {
    var doc = new jsPDF('landscape','mm' ,'a4');
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'assets\img\CertificateBackground.jpg';
    let dataSign = '';
    this.getBase64ImageFromURL('assets/img/sign.jpg').subscribe((data2:string) => {
      dataSign = data2;
    })

    this.getBase64ImageFromURL('assets/img/CertificateBackground.jpg').subscribe((data:string) => {
      data = data;

      this.Class.ClassesDetails.filter((cd) => cd.Course.isCertificate && !cd.Course.isReduction).forEach((cd , index) => {
        doc.addImage(data, 'JPEG', 5, 5, 290, 200)
        doc.setFont('Arial', null , "bold");

        let align : TextOptionsLight = {
          align: 'center'
        }

        doc.setFontSize(32);
        
        doc.text('Medical Safety Development Services', 165,70, align)

        doc.setFontSize(30);
        doc.setFont("bold");
        doc.text(this.Class.client.name, 165,120, align)

        var width = doc.getTextWidth(this.Class.client.name)/2;
        doc.setLineWidth(1.5);
        doc.line(165 - width,123 ,165 + width,123);

        let x = 0;
        console.log(CertName)
        if(CertName){
          doc.setFontSize(25);
          
          doc.text(CertName, 165 ,133, align)

          var width = doc.getTextWidth(CertName)/2;
          doc.setLineWidth(1.5);
          doc.line(165 - width,136 ,165 + width,135);
          x = 10
        }

        doc.setFontSize(20);
        
        doc.text('This office has completed the requirements for \n '+ cd.Course.titleCertificate +' \n prensented by MSDS.'
        , 165 ,135 + x, align)

        doc.setFontSize(15);
        
        doc.setLineWidth(0.4);
        doc.line(65,191,95,191);
        doc.text( new Date(this.Class.startDate).toLocaleDateString('en-US') ,80,190, align)

        doc.setFontSize(15);
        
        doc.text( "Date of Course" ,80,197, align)

        doc.addImage(dataSign, 'JPEG', 215, 181, 45 , 12)

        doc.setFontSize(15);
        
        doc.setFont('Arial');
        doc.text( "Instructor" ,239,197, align)

        if(index < this.Class.ClassesDetails.filter((cd) => cd.Course.isCertificate && !cd.Course.isReduction).length-1){
          doc.addPage()
        }
      })
      doc.save('Certificates.pdf');
    });
  }

  GeneratePDFStudentsCEU() {
    let align : TextOptionsLight = {
      align: 'center'
    }
    var doc = new jsPDF('landscape','mm' ,'a4');
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'assets\img\CertificateBackground.jpg';
    let dataSign = '';
    this.getBase64ImageFromURL('assets/img/sign.jpg').subscribe((data2:string) => {
      dataSign = data2;
    })

    this.getBase64ImageFromURL('assets/img/CertificateBackground.jpg').subscribe((data:string) => {
      data = data;

      this.Class.ClassesDetails.filter((cd) => cd.Course.isStudentCeu && !cd.Course.isReduction).forEach((cd , index) => {

        let students : Array<Student> = new Array<Student>();
        if(cd.Course.TypeStudent.id == 1){
          students = this.Class.client.Students.filter(s => s.enable)
        }
        else{
          students = cd.Students;
        }
        students.forEach((s, i) => {
          doc.addImage(data, 'JPEG', 5, 5, 290, 200)

          doc.setFontSize(28);
          
          doc.text(cd.Course.titleCertificate, 168,40, align)

          doc.setFontSize(22);
          
          doc.text('Presented by MSDS', 168,55, align)

          doc.setFontSize(16);
          
          doc.text('CEUs for '+ cd.Course.titleCertificate +'\n have been authorized by the '+ cd.Course.authorisedBy +'. \n All State Dental Boards allow CEU\'s authorized from other State and Federal '
          , 168,68, align)

          doc.setFontSize(22);
          //doc.setFontType("normal");
          let studentName = s.firstName + ' ' + s.lastName + (s.suffix!=null?', ' + s.suffix:'');
          doc.text('Name: '+ studentName, 60,120)

          doc.text('Is Authorized '+ cd.Course.authorisedCEUs + ' CEUs' , 60,135)


          doc.text('Date: '+ new Date(this.Class.startDate).toLocaleDateString('en-US'), 60,150)

          doc.text('Authorized By: '+ cd.Course.authorisedBy, 60,165)

          doc.text('Signature of Speaker: ', 60,195)

          doc.addImage(dataSign, 'JPEG', 135, 185, 65 , 12)

          if(i < students.length-1){
            doc.addPage()
          }
        })



        if(index < this.Class.ClassesDetails.filter((cd) => cd.Course.isStudentCeu).length-1){
          doc.addPage()
        }
      })
      doc.save('StudentsCEU.pdf');
    });
  }

  async GeneratePDFStudentsCard() {
    let align : TextOptionsLight = {
      align: 'center'
    }
    var doc = new jsPDF('p','mm' ,'letter');
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'assets\img\CertificateBackground.jpg';
    let dataSign = '';
    let dataMSDSLabel = '';
    let dataMSDSLogo = '';
    await this.getBase64ImageFromURL('assets/img/sign.jpg').subscribe((data2:string) => {
      dataSign = data2;
    })
    await this.getBase64ImageFromURL('assets/img/MSDSLabel.jpg').subscribe((data2:string) => {
      dataMSDSLabel = data2;
    })
    await this.getBase64ImageFromURL('assets/img/MSDSLogo.jpg').subscribe((data2:string) => {
      dataMSDSLogo = data2;
    })
    let rectX = 0;
    let rectY = 5;
    let widthCard = 100;
    let widthMiddleCard = widthCard/2;


    this.getBase64ImageFromURL('assets/img/CertificateBackground.jpg').subscribe((data:string) => {
      data = data;

      this.Class.ClassesDetails.filter((cd) => cd.Course.isStudentCard && !cd.Course.isReduction).forEach((cd , index) => {
        console.log( this.Class.ClassesDetails.filter((cd) => cd.Course.isStudentCard && !cd.Course.isReduction).length)
        let students : Array<Student> = new Array<Student>();
        if(cd.Course.TypeStudent.id == 1){
          students = this.Class.client.Students.filter(s => s.enable)
        }
        else{
          students = cd.Students;
        }
        let z = 0;
        students.forEach((s, i) => {
          rectX = 5;
          rectY += 67;
          doc.setLineWidth(.5);
          doc.rect(rectX, rectY , widthCard  , 65);

          doc.addImage(dataMSDSLogo, 'JPEG', rectX +1 , rectY + 1 , 15, 15)
          doc.addImage(dataMSDSLogo, 'JPEG', rectX  + widthCard - 16, rectY + 1, 15, 15)

          doc.addImage(dataMSDSLabel, 'JPEG', rectX + widthMiddleCard - 17, rectY + 1, 34, 10)

          doc.setFontSize(9);
          
          doc.text(cd.Course.titleCertificate, rectX + widthMiddleCard,rectY + 15, align)

          let studentName = s.firstName + ' ' + s.lastName + (s.suffix!=null?', ' + s.suffix:'');

          doc.setFontSize(14);
          doc.text(studentName, rectX + widthMiddleCard,rectY + 23, align)

          var width = doc.getTextWidth(studentName)/2+1;
          doc.setLineWidth(.4);
          doc.line(rectX + 5,rectY + 24 ,rectX + widthCard - 5,rectY + 24);

          doc.setFontSize(8);
          //doc.setFontType("normal");
          doc.text('This person named above has succefully completed a course in \n'+ cd.Course.titleCertificate + '\n according to OSHA standards '
          , rectX + widthMiddleCard,rectY + 28, align)

          doc.setFontSize(9);
          doc.text(new Date(this.Class.startDate).toLocaleDateString('en-US')
          , rectX + 12,rectY + 40, align)

          doc.line(rectX,rectY + 41 ,rectX + 24,rectY + 41);

          doc.text('ISSUE DATE', rectX + 12,rectY + 45, align)

          doc.line(rectX,rectY + 60 ,rectX + 37,rectY + 60);

          doc.text('STUDENT SIGNATURE', rectX + 1,rectY + 64 )

          let aYearFromNow = new Date(this.Class.startDate);
          aYearFromNow.setMonth(aYearFromNow.getMonth() + cd.Course.expiredMonth)

          doc.text(aYearFromNow.toLocaleDateString('en-US')
          , rectX + widthCard - 10,rectY + 40, align)

          doc.line(rectX + widthCard - 24,rectY + 41 ,rectX + widthCard,rectY + 41);

          doc.text('RENEWAL DATE', rectX + widthCard - 15,rectY + 45, align)

          doc.addImage(dataSign, 'JPEG', rectX + widthCard - 45, rectY + 53, 44.7, 8)

          doc.line(rectX + widthCard - 45,rectY + 60 ,rectX + widthCard,rectY + 60)

          doc.text('INSTRUCTOR SIGNATURE', rectX + widthCard - 41,rectY + 64 )

          doc.addPage()

        })
        if(index < this.Class.ClassesDetails.filter((cd) => cd.Course.isCertificate && !cd.Course.isReduction).length-1){
          rectY = 5;
          doc.addPage()
        }
      })
      doc.save('StudentsCards.pdf');
    });
  }

  async GeneratePDFRosterCPR(){
    let align : TextOptionsLight = {
      align: 'center'
    }
    let doc = new jsPDF('landscape', 'px','a4') as jsPDFWithPlugin;
    let xOffset = (doc.internal.pageSize.width / 2) ;
    let xHalfOffset = (xOffset / 2) ;
    let dataSign;
    let CPRClassDetail : ClassDetail = this.Class.ClassesDetails.find(cd => cd.Course.isRosterCPR)
    await this.getBase64ImageFromURL('assets/img/sign.jpg').subscribe((data2:string) => {
      dataSign = data2;

      doc.addImage(dataSign, 'JPEG', xHalfOffset + 25 , 417, 100, 25)
      doc.setFontSize(14);
      doc.text('Riverside Health System Training Center #VA000384', xHalfOffset, 23 , align )
      doc.setFontSize(10);
      doc.text('American Heart Association Emergency Cardiovascular Care Program', xHalfOffset,40 , align)
      doc.setFontSize(14);
      doc.text('Course Roster', xHalfOffset,65, align );

      doc.setFontSize(10);
      doc.text('For Training Center Use Only', xOffset + 20, 20 , {align: 'left'})
      doc.text('    Pymt Rec\'d  (date, inital) ___________     Type (TDF/$/check/CC) ____________', xOffset + 20,35 , {align: 'left'})
      doc.text('    eCards Assigned __________________________', xOffset +20, 50 , {align: 'left'})
      doc.text('    Instructor Credit Entered __________________     NL Entered _____________', xOffset + 20,65, {align: 'left'})

      doc.rect(xOffset + 20, 28, 7, 7);
      doc.rect(xOffset + 20, 43, 7, 7);
      doc.rect(xOffset + 20, 58, 7, 7);
      doc.rect(xOffset + 189, 58, 7, 7);

      doc.rect(33, 143, 7, 7);
      doc.rect(115, 143, 7, 7);
      doc.rect(33, 151, 7, 7);

      doc.rect(33, 179, 7, 7);
      doc.rect(115, 179, 7, 7);
      doc.rect(33, 187, 7, 7);

      doc.rect(98, 318, 7, 7);
      doc.rect(123, 318, 7, 7);
      doc.rect(154, 318, 7, 7);

      

      autoTable(doc , {
        theme : 'plain',
        tableWidth: doc.internal.pageSize.width-30,
        styles: { halign: "center", lineWidth : .5, cellPadding: 3} ,
        body: [
        [
            { content: 'Please indicate the NUMBER of participants successful in appropriate course.', colSpan:3,  styles: { halign: 'center' } }
            ,{ content: '***Please indicate AHA course completion ecard inventory assignment:', colSpan:2,  styles: { halign: 'center', valign:'middle' } }

          ],
          [
            { content: 'Type of Course/Card',  styles: { halign: 'center', valign:'middle', cellWidth:170 } },
            { content: '#\nNew Training ',  styles: { halign: 'center',cellWidth:70 } },
            { content: '#\nRenewal ',  styles: { halign: 'center',cellWidth:70 } },
            { content: 'Assign eCards to (INSTRUCTOR NAME): Linda L. Cannon',colSpan:2,  styles: { halign: 'center', valign:'middle'} }
          ],
          [
            { content: 'BLS Provider',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: CPRClassDetail.Students.length,  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
            { content: 'Course Director (ACLS, PALS) / Lead Instructor (BLS, Heartsaver)\nNAME: Linda L. Cannon', colSpan:2, styles: {  halign: 'left',valign:'middle'} }
          ],
          [
            { content: 'Heartsaver® CPR AED\n    Adult only CPR AED        Adult/Child CPR AED\n    Infant CPR',  styles: {  halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: 'Instructor ID#:\n060612536', styles: {  halign: 'left',valign:'middle', cellWidth:130} },
            { content: 'Status Renewal Date:', styles: {   halign: 'left', cellWidth:130} }
          ],
          [
            { content: 'Heartsaver® First Aid with CPR AED\n     Adult only CPR AED       Adult/Child CPR AED\n     Infant CPR',  styles: {  halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: 'Course Location: \n' +
            this.Class.client.name +
            '\n' +
            this.Class.address1 +
            '\n' +
            this.Class.city + ' ' + this.Class.state + ' ' + this.Class.zip,  colSpan:2, styles: {  halign: 'left',valign:'middle'} },
          ],
          [
            { content: 'Heartsaver® First Aid  (only)',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
            { content: '', colSpan:2, styles: {  halign: 'left',valign:'middle'} }
          ],
          [
            { content: 'Family  Friends® CPR',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
            { content: 'Training Site (if applicable)', colSpan:2, styles: {  halign: 'left',valign:'middle'} }
          ],
          [
            { content: 'ACLS Provider',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
            { content: 'Manikins Decontaminated by\nIntermediate Level Disinfectant', colSpan:2,rowSpan:2,  styles: {  halign: 'left',valign:'middle'} }
          ],
          [
            { content: 'PALS Provider',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
          ],
          [
            { content: 'BLS Provider',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
            { content: 'Course Start Date/Time: \n'+
            new Date(CPRClassDetail.startDate).toLocaleDateString('en-US') + ' ' + new Date(CPRClassDetail.startDate).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}), rowSpan:2,  styles: {  halign: 'left',valign:'middle', cellWidth:130} },
            { content: 'Course End Date/Time: \n'+
            new Date(CPRClassDetail.endDate).toLocaleDateString('en-US') + ' ' + new Date(CPRClassDetail.endDate).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}), rowSpan:2,  styles: {  halign: 'left',valign:'middle', cellWidth:130} },
          ],
          [
            { content: 'ACLS Provider',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
          ],
          [
            { content: 'PALS Instructor',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
            { content: 'Total Hours of Instruction:\n3 hours',rowSpan:2, styles: {  halign: 'left', cellWidth:130} },
            { content: 'Student/Manikin Ratio:\n3:1', rowSpan:2, styles: {   halign: 'left', cellWidth:130} }
          ],
          [
            { content: 'HeartCode®\nIndicate discipline:      BLS     ACLS     PALS',  styles: { halign: 'left',valign:'middle', cellWidth:170 } },
            { content: '',  styles: { halign: 'center',valign:'middle' ,cellWidth:70 } },
            { content: '',  styles: { halign: 'center',valign:'middle',cellWidth:70 } },
          ],
          [
            { content: 'Evaluation Summary\n ', colSpan:5,  styles: { halign: 'left' } },
          ],
        ],
        margin: { top: 70, bottom:-10 },
      })

      doc.autoTable({
        theme : 'plain',
        styles: { halign: 'center', lineWidth : .5} ,
        startY:353,
        body: [
        [
          { content: 'Assisting Instructors / Specialty Faculty', colSpan:3,  styles: { halign: 'center',valign:'middle' } },
        ],
        [
          { content: 'Name-     (Inst Card)     EXP DATE (Renex Date)     Day1/Day2*\n*Indicate Teaching Day(s) for ACLS PALS 2-day classes dicipline', styles: { halign: 'left',valign:'middle', cellWidth:190,fontSize:8 } },
          { content: 'Name-     (Inst Card)     EXP DATE (Renex Date)     Day1/Day2*\n*Indicate Teaching Day(s) for ACLS PALS 2-day classes dicipline', styles: { halign: 'left',valign:'middle', cellWidth:190,fontSize:8  } },
          { content: 'Name-     (Inst Card)     EXP DATE (Renex Date)     Day1/Day2*\n*Indicate Teaching Day(s) for ACLS PALS 2-day classes dicipline', styles: { halign: 'left',valign:'middle', cellWidth:190 ,fontSize:8 } },
        ],
        [
          { content: '1.', styles: { halign: 'left',valign:'middle', cellWidth:190 } },
          { content: '2.', styles: { halign: 'left',valign:'middle', cellWidth:190 } },
          { content: '3.', styles: { halign: 'left',valign:'middle', cellWidth:190 } },
        ],
        ],
        margin: { top: 0 },
      })

      doc.text('I verify that this information is accurate and truthful and that it may be confirmed.  This course was taughtin accordance with AHA guidelines.', 30, 415 , {align: 'left'})

      doc.text('Signature of Course Director / Lead instructor:', 30, 430 , {align: 'left'})
      doc.text('Date: ' + new Date(this.Class.startDate).toLocaleDateString('en-US'), xOffset + 100, 430 , {align: 'left'})
      let body = [];
      let A : Address = this.Class.client.MainAddress;
      let clientAddress =  A.address1 + '\n' + A.city + ', ' + A.state + ' ' + A.zip;
      this.Class.ClassesDetails.find(cd => cd.Course.isRosterCPR).Students.forEach((s, i) => {
        body.push({
          name : (i+1) + '.   ' + s.firstName + ' ' + s.lastName ,
          dept : '',
          kronos  : '',
          email : 'msds@cox.net',
          phone : s.phoneNumber!= null && s.phoneNumber != '' ? s.phoneNumber : this.Class.client.phoneNumber,
          time : 'No',
          scrore : 100,
          remediation : 'N/A',
          complete  : 'Yes',
          date: ''
        })

      })

      doc.autoTable({
        theme : 'plain',
        styles: { halign: 'center', lineWidth : 1 } ,
        columnStyles: { address: { halign: 'left'}, name: { halign: 'left'} },
        body: body,
        columns: [
        { header: 'Last name, First name', dataKey: 'name' },
        { header: 'Unit/\nDept. or\nSchool', dataKey: 'dept' },
        { header: 'Kronos\nID-for\nRHS', dataKey: 'kronos' },
        { header: 'Email Address for eCard', dataKey: 'email' },
        { header: 'Phone', dataKey: 'phone' },
        { header: '1st time\nstudent?', dataKey: 'time' },
        { header: 'Exam\nScore', dataKey: 'scrore' },
        { header: 'Remediation\nProvided Date', dataKey: 'remediation' },
        { header: 'Course\nComplete?', dataKey: 'complete' },
        { header: 'Date\nCard\nIssued', dataKey: 'date' },
        ],
        margin: { top: 60 },
      })
      doc.save('Rosters.pdf');
      })
  }

  async GeneratePDFRoster(isBlank = false){
    
    let align : TextOptionsLight = {
      align: 'center'
    }
    console.log('GeneratePDFRoster')
    const doc = new jsPDF('l', 'px','letter') as jsPDFWithPlugin;
    let xOffset = (doc.internal.pageSize.width / 2) ;
    //doc.autoTable({ html: '#excel-table' })
    let A : Address = this.Class.client.MainAddress;
    let clientAddress =  A.address1 + '\n' + A.city + ', ' + A.state + ' ' + A.zip;
    let dataMSDSLogo = '';
    await this.getBase64ImageFromURL('assets/img/msds_logo.jpg').subscribe( async (data2:string) => {
      dataMSDSLogo = data2;

      await this.Class.ClassesDetails.filter((cd) => (cd.Course.isRoster && !cd.Course.isReduction || (isBlank == true && !cd.Course.isReduction))).forEach(async (cd , index) => {
        let body : Array<any> = new Array<any>();
        let students : Array<Student> = new Array<Student>();
        if(cd.Course.TypeStudent.id == 1){
          students = this.Class.client.Students.filter(s => s.enable)
        }
        else{
          students = cd.Students;
        }
        await students.forEach((s, i) => {
          body.push({
            name : (i+1) + '.   ' + s.firstName + ' ' + s.lastName + '\n' + (s.email!= null ? s.email : ''),
            address : clientAddress,
            phone: s.phoneNumber!= null && s.phoneNumber != '' ? s.phoneNumber : this.Class.client.phoneNumber,
            dept : '',
            complete : 'C',
            remeadiation : 'N/A',
            scrore : 100,
            initials: ''
          })

        })
        doc.setFontSize(13);
        doc.text('Date: ' + new Date(this.Class.startDate).toLocaleDateString('en-US'), 5,18 )
        doc.text('Course Participants', 5,30 )

        doc.text('Instructor: Linda Cannon', doc.internal.pageSize.width - 5, 18 , {align: 'right'})

        doc.addImage(dataMSDSLogo, 'JPEG', doc.internal.pageSize.width - 110 , 25 , 90, 25)

        doc.setFontSize(22);
        
        doc.text('Medical Safety Development Services', xOffset,25 , align)

        doc.setFontSize(20);
        
        if(!isBlank){
          doc.text((cd.Course.titleCertificate??' '), xOffset,45 , align)
        }

        doc.autoTable({
          theme : 'plain',
          styles: { halign: 'center', lineWidth : 1 } ,
          columnStyles: { address: { halign: 'left'}, name: { halign: 'left'} },
          body: body,
          rowPageBreak: 'avoid',
          columns: [
            { header: 'Name and Email', dataKey: 'name' },
            { header: 'Home Mailing Address', dataKey: 'address' },
            { header: 'Telephone', dataKey: 'phone' },
            { header: 'Dept.', dataKey: 'dept' },
            { header: 'Comp /\nIncomp', dataKey: 'complete' },
            { header: 'Remeadiation Date\nCompleted', dataKey: 'remeadiation' },
            { header: 'Exam\nScore\n 84% or <>', dataKey: 'scrore' },
            { header: 'Initals', dataKey: 'initials' },
          ],
           margin: { top: 60, left: 8, right: 8 , bottom: 10},
        })

        if(index < this.Class.ClassesDetails.filter((cd) => (cd.Course.isRoster && !cd.Course.isReduction || (isBlank == true && !cd.Course.isReduction))).length - 1){
          await doc.addPage();
        }
      })

    	doc.save('Roster.pdf');
    })
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

  downloadOSHAInfoPdf() {
    //FileSaver.saveAs('./assets/doc/OSHA_Info.pdf','OSHA_Info');
  }
}
