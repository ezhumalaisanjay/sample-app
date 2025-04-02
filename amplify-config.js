import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,  // Change to your AWS Region
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    mandatorySignIn: false,
    authenticationFlowType: "USER_SRP_AUTH",
  },
};

Amplify.configure(awsConfig);
