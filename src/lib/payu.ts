import crypto from "crypto";

const PAYU_SALT = process.env.PAYU_SALT || "";
const PAYU_KEY = process.env.PAYU_KEY || "";

export interface PayUHashData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  lastname?: string;
  email: string;
  phone?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

/**
 * Generate PayU hash for checkout
 * Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|SALT
 */
export async function generatePayUHash(data: PayUHashData): Promise<string> {
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    lastname,
    email,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
  } = data;

  // PayU hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|SALT
  // Note: udf6-udf10 are empty (5 empty pipes between udf5 and SALT)
  const hashString = [
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    "", // udf6
    "", // udf7
    "", // udf8
    "", // udf9
    "", // udf10
    PAYU_SALT, // SALT appended at end
  ].join("|");

  return crypto.createHash("sha512").update(hashString).digest("hex");
}

/**
 * Verify PayU payment response
 * Response hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|status|SALT
 */
export async function verifyPayUResponse(
  params: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    status: string;
  },
  receivedHash: string
): Promise<boolean> {
  const { key, txnid, amount, productinfo, firstname, email, status } = params;

  // Response hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|status|SALT
  const verificationString = [
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    "", // udf1
    "", // udf2
    "", // udf3
    "", // udf4
    "", // udf5
    "", // udf6
    "", // udf7
    "", // udf8
    "", // udf9
    "", // udf10
    status,
    PAYU_SALT,
  ].join("|");

  const calculatedHash = crypto.createHash("sha512").update(verificationString).digest("hex");

  return calculatedHash === receivedHash;
}

export { PAYU_KEY, PAYU_SALT };