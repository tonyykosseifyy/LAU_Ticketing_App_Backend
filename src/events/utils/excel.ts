import * as ExcelJS from 'exceljs';
import { EventDetailed, Attendee } from '../interface/event-details'
import { IScanDetailed } from '../../scans/interface/scan.interface';

export async function createEventExcelFile(scans: IScanDetailed[]): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();

    // Add a sheet for Event Details
    const attendeesSheet = workbook.addWorksheet('Event Details');

    // Define columns for Attendees
    attendeesSheet.columns = [
        { header: 'Student ID', key: 'student_id', width: 15 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Date', key: 'date', width: 20 }
    ];

    // Add rows for each attendee
    scans.forEach((scan: IScanDetailed) => {
        const attendee = {
            student_id: scan.student.student_id,
            name: scan.student.name,
            date: scan.date 
        }
        attendeesSheet.addRow(attendee);
    });

    // Save to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}
