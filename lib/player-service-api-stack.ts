import {Vpc} from "aws-cdk-lib/aws-ec2";
import {NestedStack, NestedStackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {Cors, LambdaIntegration, RestApi, Resource} from "aws-cdk-lib/aws-apigateway";
import {EnvironmentProps} from "./types";
import {Table} from "aws-cdk-lib/aws-dynamodb";

interface PlayerServiceAPIStackProps extends NestedStackProps, EnvironmentProps {
    vpc: Vpc;
    databaseTable: Table;
}

export class PlayerServiceAPIStack extends NestedStack {
    constructor(scope: Construct, id: string, props: PlayerServiceAPIStackProps) {
        super(scope, id, props);

        const stackName = 'PlayerServiceAPI';

        const playerServiceLambda = new Function(this, stackName + 'Handler', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'playerservice.handler',
            //code: Code.fromAsset(path.join(__dirname, '../lambda')),
            code: Code.fromAsset('lambda'),
            environment: {
                DATABASE_TABLE_NAME: props.databaseTable.tableName
            },
            vpc: props.vpc,
            allowAllOutbound: true,
        });
        // Grant the lambda function the permissions to read/write from the DynamoDB table
        props.databaseTable.grantReadWriteData(playerServiceLambda);

        const api = new RestApi(this, stackName + 'ApiGateway', {
            deployOptions: {
                stageName: props.environment,
                description: 'Player Service API',
            },
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
            },
        });

        const apiRoot: Resource = api.root.addResource('api');
        const players = apiRoot.addResource('players');
        const playerById = players.addResource('{playerID}');

        const getPlayersIntegration = new LambdaIntegration(playerServiceLambda);
        const getPlayerByIdIntegration = new LambdaIntegration(playerServiceLambda);

        players.addMethod('GET', getPlayersIntegration);
        playerById.addMethod('GET', getPlayerByIdIntegration);
    }
}