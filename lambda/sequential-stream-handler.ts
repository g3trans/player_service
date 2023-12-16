export type AsyncStreamHandler = (item: any) => Promise<any>;

export class SequentialStreamHandler {
    private readonly asyncStreamHandler: AsyncStreamHandler;

    constructor(asyncStreamHandler: AsyncStreamHandler) {
        this.asyncStreamHandler = asyncStreamHandler;
    }

    // Async iterator to process sequentially and allow for WCU timeouts
    public async asyncIterateSequentially (streamReader: NodeJS.ReadableStream, pauseResumeStream: boolean) {
        for await (const item of streamReader) {
            if (pauseResumeStream) {
                streamReader.pause();
            }
            await this.asyncStreamHandler(item);

            if (pauseResumeStream) {
                streamReader.resume();
            }
        }
    }
}
