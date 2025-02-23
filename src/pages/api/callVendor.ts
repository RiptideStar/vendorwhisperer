import type { NextApiRequest, NextApiResponse } from "next";
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { vendorPhone } = req.body;
    if (!vendorPhone) {
      return res.status(400).json({ error: "Missing vendorPhone" });
    }
    try {
      const call = await client.calls.create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: vendorPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      res.status(200).json({ sid: call.sid });
    } catch (error) {
      console.error("Twilio error:", error);
      res.status(500).json({ error: "Call failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
