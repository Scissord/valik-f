"use client"
import { AIAssistant } from "../ai-assistant";
import { AIAssistantProvider } from "../ai-assistant/ai-context";

interface Props {
  children: React.ReactNode;
}
export const Provider = ({ children }: Props) => {
  return (
    <AIAssistantProvider>
      {children}
      <AIAssistant />
    </AIAssistantProvider>
  );
};
