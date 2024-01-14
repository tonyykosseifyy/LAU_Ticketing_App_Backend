export interface Attendee {
    readonly student_id: number;
    readonly name: string;
}

export interface EventDetailed {
    readonly attendees: Attendee[];
    readonly name: string;
    readonly description: string;
    readonly scan_type: 'barcode' | 'qrcode';
    readonly start_date: Date;
    readonly end_date: Date;
    readonly clubs: string[];
}