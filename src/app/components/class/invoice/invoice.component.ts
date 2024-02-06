import { Component, OnInit } from '@angular/core';
import { Classes } from '../../../models/Classes';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  
  ClassSubscription : Subscription;

  Class : Classes = new Classes();

  id :number | any;

  invoiceForm = new FormGroup({
    invoiceNumber: new FormControl(''),
    paiementDate: new FormControl(''),
    amount: new FormControl(''),
    paimentType : new FormControl(''),
    discount: new FormControl(''),
  });
  
  constructor(
    private CourseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.CourseService.getClass(this.id);
    this.ClassSubscription = this.CourseService.ClassSubject.subscribe(
      (Class : Classes) => {
        this.Class = Class;
      }
    )
    this.CourseService.emitClassSubject();
  }

}
