#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { DatabaseStack } from '../lib/database/database';
import { VpcStack } from '../lib/vpc/vpc';
import { ApiStack } from '../lib/api/api';
import { ParameterStack } from '../lib/parameters/params';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || '012345678901',
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const stageName = app.node.tryGetContext('stageName') || 'dev';
const envConfig = app.node.tryGetContext('environments')?.[stageName];

new ParameterStack(app, 'Task-Parameters', { });

new VpcStack(app, `TaskVPC-${envConfig.stageName}`, {
  env,
  stageName: envConfig.stageName
 });

const taskDb = new DatabaseStack(app, `TaskDB-${envConfig.stageName}`, {
  env,
  stageName: envConfig.stageName,
 });

new ApiStack(app, `TaskAPI-${envConfig.stageName}`, {
  env,
  stageName: envConfig.stageName,
  table: taskDb.table,
});
