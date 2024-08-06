import { Navbar } from "./_components/navbar";

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar />
      <main className="container pt-28">{children}</main>
    </div>
  );
}
