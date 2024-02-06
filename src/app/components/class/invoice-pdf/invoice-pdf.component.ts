import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Classes } from '../../../models/Classes';
import { Subscription } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Address } from '../../../models/Address';
import { Student } from '../../../models/Student';
import { jsPDF } from "jspdf";


@Component({
  selector: 'app-invoice-pdf',
  templateUrl: './invoice-pdf.component.html',
  styleUrls: ['./invoice-pdf.component.css']
})
export class InvoicePdfComponent implements OnInit {


  ClassSubscription : Subscription;

  Class : Classes = new Classes();

  id :number | any;

  Date : Date = new Date()

  addresses : Address[] ;

  AdressFormController : FormControl;

  InvoiceAdress : Address;

  constructor(
    private CourseService : CourseService,
    private route: ActivatedRoute,
  ) {
    this.addresses = new Array<Address>()
    this.InvoiceAdress = new Address()
  }

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.CourseService.getClass(this.id);

    this.ClassSubscription = this.CourseService.ClassSubject.subscribe(
      (Class : Classes) => {
        this.Class = Class;
        this.addresses = Class.client.Addresses;
        this.InvoiceAdress = this.addresses.find(a => a.isMain) != null? this.addresses.find(a => a.isMain)  : new Address();
        this.AdressFormController = new FormControl(this.InvoiceAdress)
        if(this.Class.ClassesDetails.length > 0){
          //this.Class.totalCost = this.Class.ClassesDetails.map(cd => cd.Course.isReduction?(cd.cost*-1):cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; });
          this.Class.client.MainProvider = 
          Class.client.Students.filter(s => s.isMainProvider === true).length  == 0 ?new Student(): Class.client.Students.find(s => s.isMainProvider === true);
        }
      }
    );
    this.CourseService.emitClassSubject();
  }

  getTotalReduction() : string{
    let totalReduction : number = 0;
    console.log()
    if(this.Class.ClassesDetails.filter(cd => cd.Course.isReduction).length > 0){
      totalReduction = this.Class.ClassesDetails.filter(cd => cd.Course.isReduction).map(cd => cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; });
    }
    return totalReduction.toFixed(2);
  }

  InvoiceAdressChange(){
    console.log(this.AdressFormController.value)
    this.InvoiceAdress = this.AdressFormController.value
  }

  @ViewChild('content') content : ElementRef;
  downloadPdf(){
    let doc = new jsPDF();

    let specialElementHandlers = {
      '#invoice-pdf' : function(element , render){
        return true;
      }
    };

    let content = this.content.nativeElement;
    let option =   {
      margin: 15
    }

    doc.html(content.innerHTML,option);
    
    doc.save('test.pdf')

  }

  onPrint(){
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write(document.getElementById("invoice-pdf").innerHTML);

    this.delay(300).then(()=>{
      mywindow.print();
    });

   // mywindow.close();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
