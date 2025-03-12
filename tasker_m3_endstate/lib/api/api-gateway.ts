import * as cdk from 'aws-cdk-lib';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

interface ApiGatewayProps {
  stageName: string;
  addTaskFunction: lambda.Function;
}

export class ApiGateway extends Construct {

  public readonly lambda: lambda.Function;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const { stageName, addTaskFunction  } = props;

    // Integration
    const addTaskIntegration = new HttpLambdaIntegration(`LibraryPUTIntegration-${stageName}`, addTaskFunction);

    // Task API Gateway
    const taskerTaskApi = new apigatewayv2.HttpApi(this, `TaskerTaskAPI-${stageName}`, {
      apiName: `TaskerTaskAPI-${stageName}`
    });

    // Task Routing
    taskerTaskApi.addRoutes({
      path: '/task',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: addTaskIntegration,
    });

    // Deployment stage
    new apigatewayv2.HttpStage(this, `Stage-${stageName}`, {
      httpApi: taskerTaskApi,
      stageName: `${stageName}`,
      description: `Stage: ${stageName}`,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: taskerTaskApi.apiEndpoint,
      description: 'The URL of the API Gateway',
    });

  }
}