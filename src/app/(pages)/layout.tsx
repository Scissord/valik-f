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
      <div className="md:pl-72">
        <main className="min-h-screen pt-6 md:pt-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
