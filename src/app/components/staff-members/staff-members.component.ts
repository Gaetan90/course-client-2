import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Student } from '../../models/Student';
import { ClientService } from '../../services/client.service';
import { matModules } from '../../material-module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-staff-members',
  templateUrl: './staff-members.component.html',
  styleUrls: ['./staff-members.component.css']
})
export class StaffMembersComponent implements OnInit {

  StaffMembers: Array<Student> = new Array<Student>();
  FilteredStaffMembers: Array<Student> = new Array<Student>();
  displayedColumns: string[] = [
    "client",
    "type",
    "title",
    "suffix",
    "firstName",
    "lastName",
    "phoneNumber",
    "email",
    "stateBoardLicense",
    "newsletter",
    "DEA",
    "isPrivacySecurityOfficer",
    "isOSHACoordinator",
  ]
  filters: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource : MatTableDataSource<Student>;

  constructor(
    private clientService: ClientService
    , private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.clientService.getStaffMembers().subscribe(sm => {
      this.StaffMembers = sm;
      this.FilteredStaffMembers = sm;
      this.dataSource = new MatTableDataSource<Student>(this.FilteredStaffMembers)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
    this.filters = this.fb.group({
      type: new FormControl(''),
      title: new FormControl(''),
      name: new FormControl(''),
      client: new FormControl(''),
    });
    this.filters.valueChanges.subscribe(f => {
      console.log("change")
      console.log(f)
      this.FilteredStaffMembers = this.StaffMembers.filter(sm => {
        return (
          f.name ==  ''?true: (sm.firstName.toUpperCase().includes(f.name.toUpperCase()) || sm.lastName.toUpperCase().includes(f.name.toUpperCase())) &&
          f.client == ''?true: sm.Client?.name.toUpperCase().includes(f.client.toUpperCase())
          )
        })
      console.log(this.FilteredStaffMembers)
      this.dataSource.data = this.FilteredStaffMembers;
    })
  }

  exportexcel(): void
  {
    let staffMembers : any[] = new Array<any>();
    this.StaffMembers.forEach(element => {
      staffMembers.push(
        {
          "Client":element.Client?.name,
          "Type":element.TypeStudent?.name,
          "Title":element.TitleStudent?.name,
          "suffix":element.suffix,
          "First Name":element.firstName,
          "Last Name":element.lastName,
          "Phone Number":element.phoneNumber,
          "Email":element.email,
          "State Board License":element.stateBoardLicense,
          "Newsletter":element.newsletter,
          "DEA":element.DEA,
          "Is Privacy Security Officer":element.isPrivacySecurityOfficer,
          "Is OSHA Coordinator":element.isOSHACoordinator,
        }
      )
    });
     /* table id is passed over here */
    // let element = document.getElementById('staff-members-table');
     const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(staffMembers);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, "StaffMembers.xlsx");

  }

}
