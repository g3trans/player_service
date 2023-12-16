import { BatchStreamTransform } from './batching-stream-transform';
import { Writable, Readable } from 'stream';

describe('BatchStreamTransform', () => {
    it('transforms items into batches with specified size', (done) => {
        const maxItems = 3;
        const streamTransformer = (item: any) => item.toUpperCase();
        const ignoreFirstLine = false;

        const inputItems = ['item1', 'item2', 'item3', 'item4', 'item5'];

        const expectedOutput = [['ITEM1', 'ITEM2', 'ITEM3'], ['ITEM4', 'ITEM5']];

        const inputStream = new Readable({ objectMode: true });
        inputItems.forEach((item) => inputStream.push(item));
        inputStream.push(null);

        const outputData: any[] = [];
        const outputStream = new Writable({
            objectMode: true,
            write(chunk, encoding, callback) {
                outputData.push(chunk);
                callback();
            },
        });

        const batchStreamTransform = new BatchStreamTransform(maxItems, streamTransformer, ignoreFirstLine);

        inputStream.pipe(batchStreamTransform).pipe(outputStream);

        outputStream.on('finish', () => {
            expect(outputData).toEqual(expectedOutput);
            done();
        });
    });

    it('ignores the first line if ignoreFirstLine is true', (done) => {
        const maxItems = 3;
        const streamTransformer = (item: any) => item.toUpperCase();
        const ignoreFirstLine = true;

        const inputItems = ['ignored', 'item1', 'item2', 'item3', 'item4', 'item5'];

        const expectedOutput = [['ITEM1', 'ITEM2', 'ITEM3'], ['ITEM4', 'ITEM5']];

        const inputStream = new Readable({ objectMode: true });
        inputItems.forEach((item) => inputStream.push(item));
        inputStream.push(null);

        const outputData: any[] = [];
        const outputStream = new Writable({
            objectMode: true,
            write(chunk, encoding, callback) {
                outputData.push(chunk);
                callback();
            },
        });

        const batchStreamTransform = new BatchStreamTransform(maxItems, streamTransformer, ignoreFirstLine);

        inputStream.pipe(batchStreamTransform).pipe(outputStream);

        outputStream.on('finish', () => {
            expect(outputData).toEqual(expectedOutput);
            done();
        });
    });
});
