/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { IStudent } from './interface/student.interface';
import { Model } from 'mongoose';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { ScansService } from 'src/scans/scans.service';
export declare class StudentsService {
    private readonly studentModel;
    private readonly scans;
    constructor(studentModel: Model<IStudent>, scans: ScansService);
    getAllStudents(): Promise<IStudent[]>;
    getStudentById(student_id: number): Promise<any>;
    updateStudent(updateStudentDto: UpdateStudentDto, student_id: number): Promise<IStudent>;
    createStudent(student: CreateStudentDto): Promise<IStudent>;
    deleteStudent(student_id: number): Promise<void>;
}
