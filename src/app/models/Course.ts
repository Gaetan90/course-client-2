import { CourseCategory } from './CourseCategory';
import { TypeStudent } from './TypeStudent';

export class Course {

    id:number | any;

    title: string;

    description: string;

    cost:number | any;

    isReduction: boolean | any;

    duration:number | any;

    enable: boolean | any;

    titleCertificate: string;

    isCertificate: boolean | any;

    isStudentCeu: boolean | any;

    isStudentCard: boolean | any;

    isRoster: boolean | any;

    isRosterCPR: boolean | any;

    authorisedBy: string;

    expiredMonth:number | any;

    authorisedCEUs:number | any;

    CourseCategory: CourseCategory;

    TypeStudent : TypeStudent;

}
