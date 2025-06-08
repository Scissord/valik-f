import { Footer, SideBar, Header } from "@/components";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="min-h-screen px-1 sm:px-10">
      <Header />
      <SideBar/>
      {children}
      <Footer/>
    </main>
  );
}
