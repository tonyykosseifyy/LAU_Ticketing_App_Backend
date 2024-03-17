"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventExcelFile = void 0;
const ExcelJS = require("exceljs");
const date_utils_1 = require("../../common/date-utils");
async function createEventExcelFile(scans) {
    const workbook = new ExcelJS.Workbook();
    const attendeesSheet = workbook.addWorksheet('Event Details');
    attendeesSheet.columns = [
        { header: 'Student ID', key: 'student_id', width: 15 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Date', key: 'date', width: 20, style: { numFmt: 'MM/dd/yy HH:mm:ss' } }
    ];
    scans.forEach((scan) => {
        const attendee = {
            student_id: scan.student.student_id,
            name: scan.student.name,
            date: (0, date_utils_1.convertUtcToBeirutTime)(scan.date.toISOString())
        };
        attendeesSheet.addRow(attendee);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}
exports.createEventExcelFile = createEventExcelFile;
//# sourceMappingURL=excel.js.map