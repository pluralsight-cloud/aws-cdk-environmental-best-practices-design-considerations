#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database/database';
import { VpcStack } from '../lib/vpc/vpc';
import { ApiStack } from '../lib/api/api';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || '012345678901',
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const taskVpcDev = new VpcStack(app, 'TaskVPC-Dev', {
  env,
  stageName: 'dev',
  maxAzs: 2,
});

const taskDbDev = new DatabaseStack(app, 'TaskDB-Dev', {
  env,
  stageName: 'dev',
});

new ApiStack(app, 'TaskAPI-Dev', {
  env,
  stageName: 'dev',
  vpc: taskVpcDev.vpc,
  table: taskDbDev.table,
});
