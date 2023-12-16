#!/usr/bin/env node
import 'source-map-support/register';
import {PlayerServiceStack} from '../lib/player-service-stack';
import {App, AppProps, CfnParameter, Stack} from "aws-cdk-lib";
import {EnvironmentType} from '../lib/constants'
import {Construct} from "constructs";
import {StackProps} from "aws-cdk-lib/core/lib/stack";


class PlayerServiceApp extends App {

    constructor() {
        super();
        const app = new App();

        const devoPlayerServiceStackProps= {
            environment: EnvironmentType.Development,
            env: { account: '369727180677', region: 'us-east-1' }
        }

        const prodPlayerServiceStackProps= {
            environment: EnvironmentType.Production,
            env: { account: '752371448962', region: 'us-east-1' }
        }

        const playerServiceContext = this.node.tryGetContext('playerServiceContext')

        if (playerServiceContext.environment === EnvironmentType.Production) {
            const prodStack = new PlayerServiceStack(app, 'ProdStack', prodPlayerServiceStackProps);
        } else {
            const devoStack = new PlayerServiceStack(app, 'DevoStack', devoPlayerServiceStackProps);
        }
    }
}

new PlayerServiceApp();