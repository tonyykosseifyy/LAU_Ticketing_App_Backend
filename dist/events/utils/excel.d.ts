import * as ExcelJS from 'exceljs';
import { IScanDetailed } from '../../scans/interface/scan.interface';
export declare function createEventExcelFile(scans: IScanDetailed[]): Promise<ExcelJS.Buffer>;
