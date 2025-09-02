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
      <main className="min-h-screen pt-6 md:pt-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
