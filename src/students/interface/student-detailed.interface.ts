import { IStudent } from './student.interface';

export interface IStudentDetailed extends IStudent {
    attendedCount: number ;
}