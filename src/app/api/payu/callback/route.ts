import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const PAYU_SALT = process.env.PAYU_SALT || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();

    const data: Record<string, string> = {};
    body.forEach((value, key) => {
      data[key] = value.toString();
    });

    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      lastname,
      email,
      status,
      mihpayid,
      hash,
      udf1,
      udf2,
    } = data;

    // PayU response hash MUST be calculated in reverse, starting with the SALT
    const verificationString = [
      PAYU_SALT,
      status,
      "", // udf10
      "", // udf9
      "", // udf8
      "", // udf7
      "", // udf6
      "", // udf5
      "", // udf4
      "", // udf3
      udf2 || "",
      udf1 || "",
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      key,
    ].join("|");

    const calculatedHash = crypto.createHash("sha512").update(verificationString).digest("hex");

    if (calculatedHash !== hash) {
      console.error("PayU callback: Hash mismatch!", { calculatedHash, receivedHash: hash });
      return NextResponse.json({ success: false, message: "Hash verification failed" }, { status: 403 });
    }

    // Update order status based on payment result
    if (txnid) {
      const order = await prisma.order.findUnique({
        where: { id: txnid },
      });

      if (order) {
        await prisma.order.update({
          where: { id: txnid },
          data: {
            firstName: firstname || order.firstName,
            lastName: lastname || order.lastName,
            email: email || order.email,
            status: status === "success" ? "PAID" : "FAILED",
            payuTxnId: mihpayid || null,
            payuStatus: status,
            payuResponse: data,
          },
        });

        console.log(`PayU callback: Order ${txnid} updated to ${status}`);
      } else {
        console.warn(`PayU callback: Order ${txnid} not found`);
      }
    }

    // Return acknowledgment to PayU
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayU callback error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}