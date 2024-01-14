import * as ExcelJS from 'exceljs';
import { EventDetailed, Attendee } from '../interface/event-details'

export async function createEventExcelFile(eventData: EventDetailed): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();

    // Add a sheet for Event Details
    const attendeesSheet = workbook.addWorksheet('Event Details');

    // Define columns for Attendees
    attendeesSheet.columns = [
        { header: 'Student ID', key: 'student_id', width: 15 },
        { header: 'Name', key: 'name', width: 20 }
    ];

    // Add rows for each attendee
    eventData.attendees.forEach((attendee: Attendee) => {
        attendeesSheet.addRow(attendee);
    });

    // Save to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}
