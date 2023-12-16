/// <reference types="node" />
export type AsyncStreamHandler = (item: any) => Promise<any>;
export declare class SequentialStreamHandler {
    private readonly asyncStreamHandler;
    constructor(asyncStreamHandler: AsyncStreamHandler);
    asyncIterateSequentially(streamReader: NodeJS.ReadableStream, pauseResumeStream: boolean): Promise<void>;
}
