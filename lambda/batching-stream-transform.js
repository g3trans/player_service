"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchStreamTransform = void 0;
const stream_1 = require("stream");
class BatchStreamTransform extends stream_1.Transform {
    constructor(maxItems, streamTransformer, ignoreFirstLine, options = {}) {
        options.objectMode = true;
        super(options);
        this.ignoreNextLine = ignoreFirstLine;
        this.maxItems = maxItems;
        this.streamTransformer = streamTransformer;
        this.batch = [];
    }
    _transform(item, encoding, callback) {
        if (this.ignoreNextLine) {
            this.ignoreNextLine = false;
        }
        else {
            const transformedItem = this.streamTransformer(item);
            this.batch.push(transformedItem);
            if (this.batch.length >= this.maxItems) {
                this.push(this.batch);
                this.batch = [];
            }
        }
        callback();
    }
    _flush(callback) {
        if (this.batch.length > 0) {
            this.push(this.batch);
            this.batch = [];
        }
        callback();
    }
}
exports.BatchStreamTransform = BatchStreamTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hpbmctc3RyZWFtLXRyYW5zZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhdGNoaW5nLXN0cmVhbS10cmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXNEO0FBSXRELE1BQWEsb0JBQXFCLFNBQVEsa0JBQVM7SUFNL0MsWUFBWSxRQUFnQixFQUFHLGlCQUFvQyxFQUFFLGVBQXdCLEVBQUUsVUFBZSxFQUFFO1FBQzVHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVmLElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBZSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsVUFBVSxDQUFDLElBQVMsRUFBRSxRQUF3QixFQUFFLFFBQTJCO1FBQ3ZFLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztTQUMvQjthQUFNO1lBQ0gsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2pDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ25CO1NBQ0o7UUFDRCxRQUFRLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBMkI7UUFDOUIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDbkI7UUFDRCxRQUFRLEVBQUUsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQXJDRCxvREFxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc2Zvcm0sIFRyYW5zZm9ybUNhbGxiYWNrIH0gZnJvbSBcInN0cmVhbVwiO1xyXG5cclxudHlwZSBTdHJlYW1UcmFuc2Zvcm1lciA9IChpdGVtOiBhbnkpID0+IGFueTtcclxuXHJcbmV4cG9ydCBjbGFzcyBCYXRjaFN0cmVhbVRyYW5zZm9ybSBleHRlbmRzIFRyYW5zZm9ybSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1heEl0ZW1zOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0cmVhbVRyYW5zZm9ybWVyOiBTdHJlYW1UcmFuc2Zvcm1lcjtcclxuICAgIHByaXZhdGUgaWdub3JlTmV4dExpbmU6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIGJhdGNoOiBhbnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtYXhJdGVtczogbnVtYmVyLCAgc3RyZWFtVHJhbnNmb3JtZXI6IFN0cmVhbVRyYW5zZm9ybWVyLCBpZ25vcmVGaXJzdExpbmU6IGJvb2xlYW4sIG9wdGlvbnM6IGFueSA9IHt9KSB7XHJcbiAgICAgICAgb3B0aW9ucy5vYmplY3RNb2RlID0gdHJ1ZTtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZ25vcmVOZXh0TGluZSA9IGlnbm9yZUZpcnN0TGluZTtcclxuICAgICAgICB0aGlzLm1heEl0ZW1zID0gbWF4SXRlbXM7XHJcbiAgICAgICAgdGhpcy5zdHJlYW1UcmFuc2Zvcm1lciA9IHN0cmVhbVRyYW5zZm9ybWVyO1xyXG4gICAgICAgIHRoaXMuYmF0Y2ggPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBfdHJhbnNmb3JtKGl0ZW06IGFueSwgZW5jb2Rpbmc6IEJ1ZmZlckVuY29kaW5nLCBjYWxsYmFjazogVHJhbnNmb3JtQ2FsbGJhY2spOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pZ25vcmVOZXh0TGluZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlnbm9yZU5leHRMaW5lID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRJdGVtID0gdGhpcy5zdHJlYW1UcmFuc2Zvcm1lcihpdGVtKVxyXG4gICAgICAgICAgICB0aGlzLmJhdGNoLnB1c2godHJhbnNmb3JtZWRJdGVtKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYmF0Y2gubGVuZ3RoID49IHRoaXMubWF4SXRlbXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaCh0aGlzLmJhdGNoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmF0Y2ggPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIF9mbHVzaChjYWxsYmFjazogVHJhbnNmb3JtQ2FsbGJhY2spOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5iYXRjaC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaCh0aGlzLmJhdGNoKTtcclxuICAgICAgICAgICAgdGhpcy5iYXRjaCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==