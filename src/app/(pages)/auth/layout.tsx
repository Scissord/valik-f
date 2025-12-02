export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      {/* Отключаем AI-ассистента на страницах авторизации */}
      {children}
    </main>
  );
}
