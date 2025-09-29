import dotenv from "dotenv";
dotenv.config();

//  on peut les renommer comme on veut
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;
async function getPaypalAccessToken() {
    const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET
    ).toString("base64");
    const url = `${PAYPAL_API_URL}/v1/oauth2/token`;
    const headers = {
        accept: "application/json",
        "accept-language": "fr_FR",
        Authorization: `Basic${auth}`,
    };
    const body = "grant_type=client_credentials";
    const response = await fetch(url, {
        method: "POST",
        headers,
        body,
    });
    if (!response.ok) throw new Error("Failed to get access token");
    const paypalData = await response.json();
    return paypalData.access_token;
}
export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
    try {
        const orders = await orderModel.find({
            "paymentResult.id": paypalTransactionId,
        });
        return orders.lenght === 0;
    } catch (error) {
        console.log(error);
    }
}
export async function verifyPaypalPayment(paypalTransactionId) {
    const accessToken = await getPaypalAccessToken();
    const paypalResponse = await fetch(
        `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    if (!paypalResponse.ok) throw new Error("vérification de paiment échoué ");
    const paypalData = await paypalResponse.json();
    return {
        verified:
            paypalData.status === "COMPLETED"
                ? value
                : paypalData.purchase_units[0].amount.value,
    };
}
