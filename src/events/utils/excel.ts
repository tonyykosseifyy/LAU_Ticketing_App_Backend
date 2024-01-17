import * as ExcelJS from 'exceljs';
import { IScanDetailed } from '../../scans/interface/scan.interface';
import { convertUtcToBeirutTime } from '../../common/date-utils';



export async function createEventExcelFile(scans: IScanDetailed[]): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();

    // Add a sheet for Event Details
    const attendeesSheet = workbook.addWorksheet('Event Details');

    // Define columns for Attendees
    attendeesSheet.columns = [
        { header: 'Student ID', key: 'student_id', width: 15 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Date', key: 'date', width: 20, style: { numFmt: 'MM/dd/yy HH:mm:ss' } }
    ];
    
    // Add rows for each attendee
    scans.forEach((scan: IScanDetailed) => {
        const attendee = {
            student_id: scan.student.student_id,
            name: scan.student.name,
            date: convertUtcToBeirutTime(scan.date.toISOString())
        };
        attendeesSheet.addRow(attendee);
    });

    // Save to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}
