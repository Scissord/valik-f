"use client"
import { AIAssistant } from "../ai-assistant";
import { AIAssistantProvider } from "../ai-assistant/ai-context";
import MobileNavbar from "../mobile/navbar";

interface Props {
  children: React.ReactNode;
}
export const Provider = ({ children }: Props) => {
  return (
    <AIAssistantProvider>
      {children}
      <AIAssistant />
      <MobileNavbar />
    </AIAssistantProvider>
  );
};
