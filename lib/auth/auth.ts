import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { NextRouter } from "next/router";

interface SignInResponse {
  success: boolean;
  session?: any;
  challengeName?: string;
  cognitoUser?: CognitoUser;
  userAttributes?: Record<string, string>;
}

export const signIn = async (
  email: string,
  password: string,
  userPoolId: string,
  clientId: string,
  router: NextRouter,  // ✅ Keeps router as required
  groupName?: string   // ✅ Adds groupName as an optional argument
):Promise<SignInResponse> => {
  return new Promise((resolve, reject) => {
    const poolData = { UserPoolId: userPoolId, ClientId: clientId };
    const userPool = new CognitoUserPool(poolData);
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (session) => {
        console.log("✅ Login successful:", session);

        // ✅ Store tokens in localStorage
        localStorage.setItem("idToken", session.getIdToken().getJwtToken());
        localStorage.setItem("accessToken", session.getAccessToken().getJwtToken());
        localStorage.setItem("refreshToken", session.getRefreshToken().getToken());

        // ✅ Fetch user attributes to check group
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.error("❌ Error fetching user attributes:", err.message);
            reject(err);
            return;
          }

          // ✅ Ensure attributes are defined before looping
          const userAttributes: Record<string, string> = {};
          if (attributes?.length) {
            attributes.forEach((attr) => {
              userAttributes[attr.Name] = attr.Value;
            });
          }

          console.log("📌 User attributes:", userAttributes);

          // ✅ Redirect based on user group
          const userGroup = userAttributes["custom:group"] || "";
          router.push(userGroup === "tenant" ? "/tenant/dashboard" : "/employee/dashboard");

          resolve({ success: true, session });
        });
      },

      onFailure: (err) => {
        console.error("❌ Login failed:", err.message);
        reject(err);
      },

      // ✅ Handle SMS MFA
      mfaRequired: (codeDeliveryDetails) => {
        console.log("🔹 SMS MFA Required:", codeDeliveryDetails);
        resolve({ success: false, challengeName: "SMS_MFA", cognitoUser });
      },

      // ✅ Handle TOTP (Google Authenticator)
      totpRequired: (challengeName, session) => {
        console.log("🔹 TOTP Required:", challengeName);
        resolve({
          success: false,
          challengeName: "SOFTWARE_TOKEN_MFA",
          cognitoUser,
          session,
        });
      },

      // ✅ Handle new password required
      newPasswordRequired: (userAttributes) => {
        console.log("🔹 New password required:", userAttributes);
        resolve({
          success: false,
          challengeName: "NEW_PASSWORD_REQUIRED",
          cognitoUser,
          userAttributes,
        });
      },
    });
  });
};
