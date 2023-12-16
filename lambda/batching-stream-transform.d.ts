/// <reference types="node" />
/// <reference types="node" />
import { Transform, TransformCallback } from "stream";
type StreamTransformer = (item: any) => any;
export declare class BatchStreamTransform extends Transform {
    private readonly maxItems;
    private readonly streamTransformer;
    private ignoreNextLine;
    private batch;
    constructor(maxItems: number, streamTransformer: StreamTransformer, ignoreFirstLine: boolean, options?: any);
    _transform(item: any, encoding: BufferEncoding, callback: TransformCallback): void;
    _flush(callback: TransformCallback): void;
}
export {};
