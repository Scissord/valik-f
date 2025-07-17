import { AIAssistantProvider } from "@/components/ai-assistant";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="min-h-screen w-full">
      {/* Отключаем AI-ассистента на страницах авторизации */}
      {children}
    </main>
  );
}
