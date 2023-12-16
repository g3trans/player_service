import { Transform, TransformCallback } from "stream";

type StreamTransformer = (item: any) => any;

export class BatchStreamTransform extends Transform {
    private readonly maxItems: number;
    private readonly streamTransformer: StreamTransformer;
    private ignoreNextLine: boolean;
    private batch: any[];

    constructor(maxItems: number,  streamTransformer: StreamTransformer, ignoreFirstLine: boolean, options: any = {}) {
        options.objectMode = true;
        super(options);

        this.ignoreNextLine = ignoreFirstLine;
        this.maxItems = maxItems;
        this.streamTransformer = streamTransformer;
        this.batch = [];
    }

    _transform(item: any, encoding: BufferEncoding, callback: TransformCallback): void {
        if (this.ignoreNextLine) {
            this.ignoreNextLine = false;
        } else {
            const transformedItem = this.streamTransformer(item)
            this.batch.push(transformedItem);
            if (this.batch.length >= this.maxItems) {
                this.push(this.batch);
                this.batch = [];
            }
        }
        callback();
    }

    _flush(callback: TransformCallback): void {
        if (this.batch.length > 0) {
            this.push(this.batch);
            this.batch = [];
        }
        callback();
    }
}
