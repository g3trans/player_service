"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackfillPlayerCsvStreamToDDB = void 0;
const csv = require("csv-parser");
const batching_stream_transform_1 = require("./batching-stream-transform");
const sequential_stream_handler_1 = require("./sequential-stream-handler");
const ddb_manager_1 = require("./ddb-manager");
class BackfillPlayerCsvStreamToDDB {
    mapPlayerCsvTypes(csvData) {
        const fieldTypes = {
            birthYear: "Number",
            birthMonth: "Number",
            birthDay: "Number",
            weight: "Number",
            height: "Number",
            debut: "Date",
            finalGame: "Date",
        };
        const convertedData = { ...csvData };
        Object.entries(fieldTypes).forEach(([fieldName, fieldType]) => {
            if (convertedData[fieldName] !== undefined) {
                if (fieldType === "Number") {
                    convertedData[fieldName] = Number(convertedData[fieldName]);
                }
                else if (fieldType === "Date") {
                    convertedData[fieldName] = new Date(convertedData[fieldName]);
                }
            }
        });
        return convertedData;
    }
    ;
    constructor(stream, pauseResumeStream, destinationTableName) {
        this.stream = stream;
        this.pauseResumeStream = pauseResumeStream;
        this.destinationTableName = destinationTableName;
        this.PLAYER_CSV_HEADERS = [
            'playerID', 'birthYear', 'birthMonth', 'birthDay', 'birthCountry',
            'birthState', 'birthCity', 'deathYear', 'deathMonth', 'deathDay',
            'deathCountry', 'deathState', 'deathCity', 'nameFirst', 'nameLast',
            'nameGiven', 'weight', 'height', 'bats', 'throws', 'debut',
            'finalGame', 'retroID', 'bbrefID'
        ];
        this.ddbManager = new ddb_manager_1.DynamoDBManager();
    }
    async process() {
        let totalProcessed = 0;
        let batchCount = 0;
        const batchCsvRecordStream = new batching_stream_transform_1.BatchStreamTransform(this.ddbManager.BATCH_MAXIMUM_SIZE, (item) => ({
            PutRequest: {
                Item: this.mapPlayerCsvTypes(item),
            },
        }), true);
        const sequentialStreamReader = new sequential_stream_handler_1.SequentialStreamHandler(async (item) => {
            totalProcessed += item.length;
            batchCount += 1;
            console.log(`Upserting ${item.length} items to the db. Batch count: ${batchCount}`);
            await this.ddbManager.putRateLimitedBatch(item, this.destinationTableName);
        });
        const csvPipeReader = this.stream.pipe(csv({ headers: this.PLAYER_CSV_HEADERS })).pipe(batchCsvRecordStream);
        return new Promise((resolve, reject) => {
            sequentialStreamReader.asyncIterateSequentially(csvPipeReader, this.pauseResumeStream).then(() => resolve());
        });
    }
}
exports.BackfillPlayerCsvStreamToDDB = BackfillPlayerCsvStreamToDDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2ZpbGwtcGxheWVyLWNzdi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhY2tmaWxsLXBsYXllci1jc3YudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0NBQWtDO0FBQ2xDLDJFQUFtRTtBQUNuRSwyRUFBc0U7QUFDdEUsK0NBQWdEO0FBTWhELE1BQWEsNEJBQTRCO0lBWTdCLGlCQUFpQixDQUFDLE9BQWdCO1FBQ3RDLE1BQU0sVUFBVSxHQUFzQztZQUNsRCxTQUFTLEVBQUUsUUFBUTtZQUNuQixVQUFVLEVBQUUsUUFBUTtZQUNwQixRQUFRLEVBQUUsUUFBUTtZQUNsQixNQUFNLEVBQUUsUUFBUTtZQUNoQixNQUFNLEVBQUUsUUFBUTtZQUNoQixLQUFLLEVBQUUsTUFBTTtZQUNiLFNBQVMsRUFBRSxNQUFNO1NBQ3BCLENBQUM7UUFFRixNQUFNLGFBQWEsR0FBWSxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFFOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFO1lBQzFELElBQUksYUFBYSxDQUFDLFNBQTBCLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ3pELElBQUksU0FBUyxLQUFLLFFBQVEsRUFBRTtvQkFDeEIsYUFBYSxDQUFDLFNBQTBCLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQTBCLENBQUMsQ0FBQyxDQUFDO2lCQUNqRztxQkFBTSxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7b0JBQzdCLGFBQWEsQ0FBQyxTQUEwQixDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQTBCLENBQUMsQ0FBQyxDQUFDO2lCQUNuRzthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBQUEsQ0FBQztJQUVGLFlBQW9CLE1BQTZCLEVBQzdCLGlCQUEwQixFQUMxQixvQkFBNEI7UUFGNUIsV0FBTSxHQUFOLE1BQU0sQ0FBdUI7UUFDN0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFTO1FBQzFCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBUTtRQXBDL0IsdUJBQWtCLEdBQWE7WUFDNUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGNBQWM7WUFDakUsWUFBWSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFVBQVU7WUFDaEUsY0FBYyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVU7WUFDbEUsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQzFELFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUztTQUNwQyxDQUFDO1FBK0JFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSw2QkFBZSxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPO1FBQ2hCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFbkIsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGdEQUFvQixDQUNqRCxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUNsQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNaLFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQzthQUNyQztTQUNKLENBQUMsRUFDRixJQUFJLENBQ1AsQ0FBQztRQUVGLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxtREFBdUIsQ0FBQyxLQUFLLEVBQUUsSUFBVyxFQUFFLEVBQUU7WUFDN0UsY0FBYyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDOUIsVUFBVSxJQUFJLENBQUMsQ0FBQztZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxDQUFDLE1BQU0sa0NBQWtDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDcEYsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFN0csT0FBTyxJQUFJLE9BQU8sQ0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN6QyxzQkFBc0IsQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakgsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUF2RUQsb0VBdUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3N2IGZyb20gXCJjc3YtcGFyc2VyXCI7XHJcbmltcG9ydCB7IEJhdGNoU3RyZWFtVHJhbnNmb3JtIH0gZnJvbSBcIi4vYmF0Y2hpbmctc3RyZWFtLXRyYW5zZm9ybVwiO1xyXG5pbXBvcnQgeyBTZXF1ZW50aWFsU3RyZWFtSGFuZGxlciB9IGZyb20gXCIuL3NlcXVlbnRpYWwtc3RyZWFtLWhhbmRsZXJcIjtcclxuaW1wb3J0IHsgRHluYW1vREJNYW5hZ2VyIH0gZnJvbSBcIi4vZGRiLW1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ3N2RGF0YSB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFja2ZpbGxQbGF5ZXJDc3ZTdHJlYW1Ub0REQiB7XHJcblxyXG4gICAgcHJpdmF0ZSBkZGJNYW5hZ2VyOiBEeW5hbW9EQk1hbmFnZXI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBQTEFZRVJfQ1NWX0hFQURFUlM6IHN0cmluZ1tdID0gW1xyXG4gICAgICAgICdwbGF5ZXJJRCcsICdiaXJ0aFllYXInLCAnYmlydGhNb250aCcsICdiaXJ0aERheScsICdiaXJ0aENvdW50cnknLFxyXG4gICAgICAgICdiaXJ0aFN0YXRlJywgJ2JpcnRoQ2l0eScsICdkZWF0aFllYXInLCAnZGVhdGhNb250aCcsICdkZWF0aERheScsXHJcbiAgICAgICAgJ2RlYXRoQ291bnRyeScsICdkZWF0aFN0YXRlJywgJ2RlYXRoQ2l0eScsICduYW1lRmlyc3QnLCAnbmFtZUxhc3QnLFxyXG4gICAgICAgICduYW1lR2l2ZW4nLCAnd2VpZ2h0JywgJ2hlaWdodCcsICdiYXRzJywgJ3Rocm93cycsICdkZWJ1dCcsXHJcbiAgICAgICAgJ2ZpbmFsR2FtZScsICdyZXRyb0lEJywgJ2JicmVmSUQnXHJcbiAgICBdO1xyXG5cclxuICAgIHByaXZhdGUgbWFwUGxheWVyQ3N2VHlwZXMoY3N2RGF0YTogQ3N2RGF0YSk6IENzdkRhdGEge1xyXG4gICAgICAgIGNvbnN0IGZpZWxkVHlwZXM6IFJlY29yZDxzdHJpbmcsICdOdW1iZXInIHwgJ0RhdGUnPiA9IHtcclxuICAgICAgICAgICAgYmlydGhZZWFyOiBcIk51bWJlclwiLFxyXG4gICAgICAgICAgICBiaXJ0aE1vbnRoOiBcIk51bWJlclwiLFxyXG4gICAgICAgICAgICBiaXJ0aERheTogXCJOdW1iZXJcIixcclxuICAgICAgICAgICAgd2VpZ2h0OiBcIk51bWJlclwiLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IFwiTnVtYmVyXCIsXHJcbiAgICAgICAgICAgIGRlYnV0OiBcIkRhdGVcIixcclxuICAgICAgICAgICAgZmluYWxHYW1lOiBcIkRhdGVcIixcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjb252ZXJ0ZWREYXRhOiBDc3ZEYXRhID0geyAuLi5jc3ZEYXRhIH07XHJcblxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGZpZWxkVHlwZXMpLmZvckVhY2goKFtmaWVsZE5hbWUsIGZpZWxkVHlwZV0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGNvbnZlcnRlZERhdGFbZmllbGROYW1lIGFzIGtleW9mIENzdkRhdGFdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChmaWVsZFR5cGUgPT09IFwiTnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWREYXRhW2ZpZWxkTmFtZSBhcyBrZXlvZiBDc3ZEYXRhXSA9IE51bWJlcihjb252ZXJ0ZWREYXRhW2ZpZWxkTmFtZSBhcyBrZXlvZiBDc3ZEYXRhXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkVHlwZSA9PT0gXCJEYXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWREYXRhW2ZpZWxkTmFtZSBhcyBrZXlvZiBDc3ZEYXRhXSA9IG5ldyBEYXRlKGNvbnZlcnRlZERhdGFbZmllbGROYW1lIGFzIGtleW9mIENzdkRhdGFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udmVydGVkRGF0YTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBzdHJlYW06IE5vZGVKUy5SZWFkYWJsZVN0cmVhbSxcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgcGF1c2VSZXN1bWVTdHJlYW06IGJvb2xlYW4sXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGRlc3RpbmF0aW9uVGFibGVOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmRkYk1hbmFnZXIgPSBuZXcgRHluYW1vREJNYW5hZ2VyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHRvdGFsUHJvY2Vzc2VkID0gMDtcclxuICAgICAgICBsZXQgYmF0Y2hDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhdGNoQ3N2UmVjb3JkU3RyZWFtID0gbmV3IEJhdGNoU3RyZWFtVHJhbnNmb3JtKFxyXG4gICAgICAgICAgICB0aGlzLmRkYk1hbmFnZXIuQkFUQ0hfTUFYSU1VTV9TSVpFLFxyXG4gICAgICAgICAgICAoaXRlbTogYW55KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgUHV0UmVxdWVzdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIEl0ZW06IHRoaXMubWFwUGxheWVyQ3N2VHlwZXMoaXRlbSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgdHJ1ZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcXVlbnRpYWxTdHJlYW1SZWFkZXIgPSBuZXcgU2VxdWVudGlhbFN0cmVhbUhhbmRsZXIoYXN5bmMgKGl0ZW06IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgIHRvdGFsUHJvY2Vzc2VkICs9IGl0ZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgICBiYXRjaENvdW50ICs9IDE7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBVcHNlcnRpbmcgJHtpdGVtLmxlbmd0aH0gaXRlbXMgdG8gdGhlIGRiLiBCYXRjaCBjb3VudDogJHtiYXRjaENvdW50fWApO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRkYk1hbmFnZXIucHV0UmF0ZUxpbWl0ZWRCYXRjaChpdGVtLCB0aGlzLmRlc3RpbmF0aW9uVGFibGVOYW1lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgY3N2UGlwZVJlYWRlciA9IHRoaXMuc3RyZWFtLnBpcGUoY3N2KHsgaGVhZGVyczogdGhpcy5QTEFZRVJfQ1NWX0hFQURFUlMgfSkpLnBpcGUoYmF0Y2hDc3ZSZWNvcmRTdHJlYW0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBzZXF1ZW50aWFsU3RyZWFtUmVhZGVyLmFzeW5jSXRlcmF0ZVNlcXVlbnRpYWxseShjc3ZQaXBlUmVhZGVyLCB0aGlzLnBhdXNlUmVzdW1lU3RyZWFtKS50aGVuKCgpID0+IHJlc29sdmUoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19