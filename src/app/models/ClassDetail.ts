import {  Student } from "./Student";
import { Classes } from "./Classes";
import { Course } from "./Course";

export class ClassDetail {

    id:number | any;

    comment: string;

    startDate: Date;

    endDate: Date;

    cost :number | any;
    order :number | any;

    Students: Student[];

    Class: Classes | null;

    Course: Course;



}
