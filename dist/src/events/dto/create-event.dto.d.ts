export declare class CreateEventDto {
    readonly name: string;
    readonly description: string;
    readonly scan_type?: string;
    readonly start_date: Date;
    readonly end_date: Date;
    users?: string[];
}
