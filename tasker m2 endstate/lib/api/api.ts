import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ApiGateway } from './api-gateway';
import { LambdaFunction } from './lambda';

interface ApiStackProps extends cdk.StackProps {
  stageName: string;
  table: dynamodb.TableV2;
}

export class ApiStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { stageName, table } = props;

    const vpcName = `TaskerVPC-${stageName}`;
    const vpc = ec2.Vpc.fromLookup(this, 'TaskerVPC', {
      vpcName,
    });    

    // Instantiate Lambda function(s)
    const lambda = new LambdaFunction(this, 'CreateFunctions', {
      stageName,
      table,
      vpc,
    });

    // Instantiate API Gateway
    const apiGateway = new ApiGateway(this, 'CreateAPIGateway', {
      stageName,
      addTaskFunction: lambda.addTaskFunction,
    });

  }
}