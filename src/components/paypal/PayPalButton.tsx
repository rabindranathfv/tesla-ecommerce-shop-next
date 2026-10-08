"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (details: any) => void;
}

export const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: amount.toString(),
              },
            },
          ],
          intent: "CAPTURE",
        });
      }}
      onApprove={async (data, actions) => {
        const details = await actions.order?.capture();
        onSuccess?.(details);
      }}
    />
  );
};
