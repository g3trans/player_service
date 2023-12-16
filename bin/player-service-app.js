#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const player_service_stack_1 = require("../lib/player-service-stack");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constants_1 = require("../lib/constants");
class PlayerServiceApp extends aws_cdk_lib_1.App {
    constructor() {
        super();
        const app = new aws_cdk_lib_1.App();
        const devoPlayerServiceStackProps = {
            environment: constants_1.EnvironmentType.Development,
            env: { account: '369727180677', region: 'us-east-1' }
        };
        const prodPlayerServiceStackProps = {
            environment: constants_1.EnvironmentType.Production,
            env: { account: '752371448962', region: 'us-east-1' }
        };
        const playerServiceContext = this.node.tryGetContext('playerServiceContext');
        if (playerServiceContext.environment === constants_1.EnvironmentType.Production) {
            const prodStack = new player_service_stack_1.PlayerServiceStack(app, 'ProdStack', prodPlayerServiceStackProps);
        }
        else {
            const devoStack = new player_service_stack_1.PlayerServiceStack(app, 'DevoStack', devoPlayerServiceStackProps);
        }
    }
}
new PlayerServiceApp();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLXNlcnZpY2UtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxheWVyLXNlcnZpY2UtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxzRUFBK0Q7QUFDL0QsNkNBQStEO0FBQy9ELGdEQUFnRDtBQUtoRCxNQUFNLGdCQUFpQixTQUFRLGlCQUFHO0lBRTlCO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztRQUV0QixNQUFNLDJCQUEyQixHQUFFO1lBQy9CLFdBQVcsRUFBRSwyQkFBZSxDQUFDLFdBQVc7WUFDeEMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO1NBQ3hELENBQUE7UUFFRCxNQUFNLDJCQUEyQixHQUFFO1lBQy9CLFdBQVcsRUFBRSwyQkFBZSxDQUFDLFVBQVU7WUFDdkMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO1NBQ3hELENBQUE7UUFFRCxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUE7UUFFNUUsSUFBSSxvQkFBb0IsQ0FBQyxXQUFXLEtBQUssMkJBQWUsQ0FBQyxVQUFVLEVBQUU7WUFDakUsTUFBTSxTQUFTLEdBQUcsSUFBSSx5Q0FBa0IsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLDJCQUEyQixDQUFDLENBQUM7U0FDM0Y7YUFBTTtZQUNILE1BQU0sU0FBUyxHQUFHLElBQUkseUNBQWtCLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1NBQzNGO0lBQ0wsQ0FBQztDQUNKO0FBRUQsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0IHtQbGF5ZXJTZXJ2aWNlU3RhY2t9IGZyb20gJy4uL2xpYi9wbGF5ZXItc2VydmljZS1zdGFjayc7XG5pbXBvcnQge0FwcCwgQXBwUHJvcHMsIENmblBhcmFtZXRlciwgU3RhY2t9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHtFbnZpcm9ubWVudFR5cGV9IGZyb20gJy4uL2xpYi9jb25zdGFudHMnXG5pbXBvcnQge0NvbnN0cnVjdH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7U3RhY2tQcm9wc30gZnJvbSBcImF3cy1jZGstbGliL2NvcmUvbGliL3N0YWNrXCI7XG5cblxuY2xhc3MgUGxheWVyU2VydmljZUFwcCBleHRlbmRzIEFwcCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgICAgIGNvbnN0IGRldm9QbGF5ZXJTZXJ2aWNlU3RhY2tQcm9wcz0ge1xuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IEVudmlyb25tZW50VHlwZS5EZXZlbG9wbWVudCxcbiAgICAgICAgICAgIGVudjogeyBhY2NvdW50OiAnMzY5NzI3MTgwNjc3JywgcmVnaW9uOiAndXMtZWFzdC0xJyB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9kUGxheWVyU2VydmljZVN0YWNrUHJvcHM9IHtcbiAgICAgICAgICAgIGVudmlyb25tZW50OiBFbnZpcm9ubWVudFR5cGUuUHJvZHVjdGlvbixcbiAgICAgICAgICAgIGVudjogeyBhY2NvdW50OiAnNzUyMzcxNDQ4OTYyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwbGF5ZXJTZXJ2aWNlQ29udGV4dCA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdwbGF5ZXJTZXJ2aWNlQ29udGV4dCcpXG5cbiAgICAgICAgaWYgKHBsYXllclNlcnZpY2VDb250ZXh0LmVudmlyb25tZW50ID09PSBFbnZpcm9ubWVudFR5cGUuUHJvZHVjdGlvbikge1xuICAgICAgICAgICAgY29uc3QgcHJvZFN0YWNrID0gbmV3IFBsYXllclNlcnZpY2VTdGFjayhhcHAsICdQcm9kU3RhY2snLCBwcm9kUGxheWVyU2VydmljZVN0YWNrUHJvcHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGV2b1N0YWNrID0gbmV3IFBsYXllclNlcnZpY2VTdGFjayhhcHAsICdEZXZvU3RhY2snLCBkZXZvUGxheWVyU2VydmljZVN0YWNrUHJvcHMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5uZXcgUGxheWVyU2VydmljZUFwcCgpOyJdfQ==