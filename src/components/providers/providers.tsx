"use client"
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AIAssistant } from "../ai-assistant";
import { AIAssistantProvider } from "../ai-assistant/ai-context";

interface Props {
  children: React.ReactNode;
}
export const Provider = ({ children }: Props) => {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" ,intent:"capture",currency:"USD"}}>
      <SessionProvider>
        <AIAssistantProvider>
          {children}
          <AIAssistant />
        </AIAssistantProvider>
      </SessionProvider>
    </PayPalScriptProvider>
  );
};
