"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequentialStreamHandler = void 0;
class SequentialStreamHandler {
    constructor(asyncStreamHandler) {
        this.asyncStreamHandler = asyncStreamHandler;
    }
    // Async iterator to process sequentially and allow for WCU timeouts
    async asyncIterateSequentially(streamReader, pauseResumeStream) {
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
exports.SequentialStreamHandler = SequentialStreamHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVudGlhbC1zdHJlYW0taGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcXVlbnRpYWwtc3RyZWFtLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSx1QkFBdUI7SUFHaEMsWUFBWSxrQkFBc0M7UUFDOUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0lBQ2pELENBQUM7SUFFRCxvRUFBb0U7SUFDN0QsS0FBSyxDQUFDLHdCQUF3QixDQUFFLFlBQW1DLEVBQUUsaUJBQTBCO1FBQ2xHLElBQUksS0FBSyxFQUFFLE1BQU0sSUFBSSxJQUFJLFlBQVksRUFBRTtZQUNuQyxJQUFJLGlCQUFpQixFQUFFO2dCQUNuQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDeEI7WUFDRCxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVwQyxJQUFJLGlCQUFpQixFQUFFO2dCQUNuQixZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDekI7U0FDSjtJQUNMLENBQUM7Q0FDSjtBQXBCRCwwREFvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBBc3luY1N0cmVhbUhhbmRsZXIgPSAoaXRlbTogYW55KSA9PiBQcm9taXNlPGFueT47XHJcblxyXG5leHBvcnQgY2xhc3MgU2VxdWVudGlhbFN0cmVhbUhhbmRsZXIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3luY1N0cmVhbUhhbmRsZXI6IEFzeW5jU3RyZWFtSGFuZGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihhc3luY1N0cmVhbUhhbmRsZXI6IEFzeW5jU3RyZWFtSGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuYXN5bmNTdHJlYW1IYW5kbGVyID0gYXN5bmNTdHJlYW1IYW5kbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFzeW5jIGl0ZXJhdG9yIHRvIHByb2Nlc3Mgc2VxdWVudGlhbGx5IGFuZCBhbGxvdyBmb3IgV0NVIHRpbWVvdXRzXHJcbiAgICBwdWJsaWMgYXN5bmMgYXN5bmNJdGVyYXRlU2VxdWVudGlhbGx5IChzdHJlYW1SZWFkZXI6IE5vZGVKUy5SZWFkYWJsZVN0cmVhbSwgcGF1c2VSZXN1bWVTdHJlYW06IGJvb2xlYW4pIHtcclxuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IGl0ZW0gb2Ygc3RyZWFtUmVhZGVyKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXVzZVJlc3VtZVN0cmVhbSkge1xyXG4gICAgICAgICAgICAgICAgc3RyZWFtUmVhZGVyLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hc3luY1N0cmVhbUhhbmRsZXIoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGF1c2VSZXN1bWVTdHJlYW0pIHtcclxuICAgICAgICAgICAgICAgIHN0cmVhbVJlYWRlci5yZXN1bWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=