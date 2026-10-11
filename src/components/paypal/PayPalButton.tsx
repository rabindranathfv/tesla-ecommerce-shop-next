"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { paypalCheckPayment, setTransactionId } from "@/actions";
// import { paypalCheckPayment, setTransactionId } from '@/actions';

interface PayPalButtonProps {
  amount: number;
  orderId: string;
}

export const PayPalButton = ({ amount, orderId }: PayPalButtonProps) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-11 bg-gray-300 rounded-full"></div>
        <div className="h-11 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions,
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          reference_id: orderId, // This makes a reference from the paypalAPI
          amount: {
            currency_code: "EUR",
            value: roundedAmount.toString(),
          },
        },
      ],
      intent: "CAPTURE",
    });

    const { ok, message } = await setTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error(
        `Failed to set transaction ID for order ${orderId}: ${message}`,
      );
    }
    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details) return;

    const paymentCheck = await paypalCheckPayment(data.orderID);

    if (!paymentCheck.ok) {
      throw new Error("PayPal payment validation failed");
    }
  };

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};
