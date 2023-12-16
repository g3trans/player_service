/// <reference types="node" />
export interface CsvData {
    [key: string]: string | number | Date;
}
export declare class BackfillPlayerCsvStreamToDDB {
    private stream;
    private pauseResumeStream;
    private destinationTableName;
    private ddbManager;
    private readonly PLAYER_CSV_HEADERS;
    private mapPlayerCsvTypes;
    constructor(stream: NodeJS.ReadableStream, pauseResumeStream: boolean, destinationTableName: string);
    process(): Promise<void>;
}
