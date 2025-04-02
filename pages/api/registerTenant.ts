import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = "https://is9zyfo7ob.execute-api.ap-south-1.amazonaws.com/Test/Create-Cognito-User-Pool";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.log("❌ Method Not Allowed:", req.method);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  console.log("🔹 Received API request:", req.body);

  try {
    const { tenant_name, user_pool_id, UserId, identity_pool_id, client_id, admin_name, admin_email, admin_password, phone_number, confirmationCode } = req.body;

    if (!tenant_name || !admin_email || !admin_password || !admin_name) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    if (confirmationCode && !client_id) {
      return res.status(400).json({ message: "❌ Missing client_id for confirmation" });
    }

    let payloadData: any = {
      identity_pool_id,
      UserId,
      user_pool_id,
      tenant_name,
      admin_name,
      admin_email,
      admin_password,
      phone_number,
      client_id,
      action: confirmationCode ? "confirm_sign_up" : "sign_up",
    };

    if (confirmationCode) {
      payloadData.confirmationCode = confirmationCode;
    }

    console.log("✅ Sending request to API Gateway...", payloadData);

    const response = await axios.post(API_URL, payloadData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.errorMessage) {
      console.error("❌ API Gateway Error:", response.data.errorMessage);
      return res.status(500).json({ message: "API Execution Failed", error: response.data.errorMessage });
    }

    let createdClientId = response.data.client_id;

    if (confirmationCode) {
      console.log("✅ User successfully confirmed:", response.data);
      return res.status(200).json({ message: "User confirmed successfully", data: response.data, client_id: createdClientId });
    }

    console.log("✅ Tenant successfully created:", response.data);
    return res.status(200).json({ message: "Tenant created successfully", data: response.data, client_id: createdClientId });

  } catch (err: any) {
    console.error("❌ API Error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Error processing request", error: err.response?.data || err.message });
  }
}
