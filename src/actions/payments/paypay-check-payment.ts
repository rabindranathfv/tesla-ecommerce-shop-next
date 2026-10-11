"use server";

import { PaypalPaymentOrderStatusResponse } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const oauthUrl = process.env.PAYPAL_OAUTH_URL;

  if (!clientId || !clientSecret || !oauthUrl) {
    throw new Error(
      "Missing PayPal credentials or OAuth URL in environment variables",
    );
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );

    const response = await fetch(oauthUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
        cache: "no-store",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PayPal OAuth request failed: ${response.status} ${errorText}`,
      );
    }

    const tokenData = (await response.json()) as PayPalAccessTokenResponse;
    return tokenData.access_token;
  } catch (error) {
    console.error("Failed to get PayPal bearer token:", error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string,
): Promise<PaypalPaymentOrderStatusResponse | null> => {
  const ordersUrl = process.env.PAYPAL_ORDERS_URL;

  if (!ordersUrl) {
    throw new Error("Missing PAYPAL_ORDERS_URL in environment variables");
  }

  try {
    const response = await fetch(`${ordersUrl}/${paypalTransactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        cache: "no-store",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PayPal order lookup failed: ${response.status} ${errorText}`,
      );
    }

    return (await response.json()) as PaypalPaymentOrderStatusResponse;
  } catch (error) {
    console.error(
      `Failed to get PayPal order for transaction ${paypalTransactionId}:`,
      error,
    );
    return null;
  }
};

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  try {
    const authPaypal = await getPayPalBearerToken();

    if (!authPaypal) {
      return {
        ok: false,
        message: "Failed to authenticate with PayPal",
      };
    }

    console.log(
      `getting PayPal order for transaction ID: ${paypalTransactionId}`,
    );
    const order = await verifyPayPalPayment(paypalTransactionId, authPaypal);

    if (!order) {
      return {
        ok: false,
        message: `PayPal order ${paypalTransactionId} could not be verified`,
      };
    }

    const { status, purchase_units } = order;
    // this reference_id corresponds to the order ID in our system
    const { reference_id: orderId } = purchase_units[0];

    if (status !== "COMPLETED") {
      return {
        ok: false,
        message: `PayPal order ${paypalTransactionId} is not PAID`,
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
    };
  } catch (error) {
    console.error(
      `Failed to check PayPal payment for transaction ${paypalTransactionId}:`,
      error,
    );
    return {
      ok: false,
      message: `Failed to check PayPal payment for transaction ${paypalTransactionId}`,
    };
  }
};
