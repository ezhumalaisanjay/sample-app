import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  

  try {
    console.log("🔹 Fetching tenant details for:", email);

    const response = await fetch(
      "https://is9zyfo7ob.execute-api.ap-south-1.amazonaws.com/Test/scansDynamoDB",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: JSON.stringify({ email }) }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const text = await response.text();
    console.log("🔹 Raw API Response:", text);

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      throw new Error("Failed to parse first-level API response");
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(parsedData.body);
    } catch (parseError) {
      throw new Error("Failed to parse `body` field from API response");
    }

    console.log("🔹 Final Parsed Response:", JSON.stringify(parsedBody, null, 2));

    if (!parsedBody?.UserPoolId || !parsedBody?.ClientId) {
      return res.status(404).json({ message: "Tenant not found or invalid response" });
    }

    return res.status(200).json(parsedBody);
  } catch (error: any) {
    console.error("❌ API Call Error:", error.message);
    return res.status(500).json({ message: "Error fetching tenant data", error: error.message });
  }
}
