#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database/database';
import { VpcStack } from '../lib/vpc/vpc';
import { ApiStack } from '../lib/api/api';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || '891377100138',
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const stageName = app.node.tryGetContext('stageName') || 'dev';
const envConfig = app.node.tryGetContext('environments')?.[stageName];

const taskVpc = new VpcStack(app, `TaskVPC-${envConfig.stageName}`, {
  env,
  stageName: envConfig.stageName,
  maxAzs: envConfig.maxAzs,
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