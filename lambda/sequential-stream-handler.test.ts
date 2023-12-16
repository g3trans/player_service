import { SequentialStreamHandler, AsyncStreamHandler } from './sequential-stream-handler';
import { Readable } from 'stream';

describe('SequentialStreamHandler', () => {
    let sequentialStreamHandler: SequentialStreamHandler;

    const mockStreamReader: Readable = {
        _read() {},
        [Symbol.asyncIterator]: async function* () {
            yield 1;
            yield 2;
            yield 3;
        },
        readable: true,
        read(size?: number) {
            return this[Symbol.asyncIterator]().toString();
        },
        setEncoding(encoding: BufferEncoding) {
            return this;
        },
        isPaused: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        // add all other 19 required ReadableStream methods
    } as any;

    const mockAsyncStreamHandler: AsyncStreamHandler = jest.fn();

    beforeEach(() => {
        sequentialStreamHandler = new SequentialStreamHandler(mockAsyncStreamHandler);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should iterate sequentially without pausing/resuming the stream', async () => {
        await sequentialStreamHandler.asyncIterateSequentially(mockStreamReader, false);

        expect(mockAsyncStreamHandler).toHaveBeenCalledWith(1);
        expect(mockAsyncStreamHandler).toHaveBeenCalledWith(2);
        expect(mockAsyncStreamHandler).toHaveBeenCalledWith(3);
        expect(mockStreamReader.pause).not.toHaveBeenCalled();
        expect(mockStreamReader.resume).not.toHaveBeenCalled();
    });

    it('should iterate sequentially with pausing/resuming the stream', async () => {
        await sequentialStreamHandler.asyncIterateSequentially(mockStreamReader, true);

        expect(mockAsyncStreamHandler).toHaveBeenCalledWith(1);
        expect(mockStreamReader.pause).toHaveBeenCalledTimes(3);
        expect(mockStreamReader.resume).toHaveBeenCalledTimes(3);
    });
});