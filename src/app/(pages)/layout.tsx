import { Footer, SideBar, Header } from "@/components";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Header />
      <SideBar />
      <div className="min-h-screen pt-28 md:pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <main className="flex-1">
            {children}
          </main>
      </div>
      <Footer />
    </>
  );
}
