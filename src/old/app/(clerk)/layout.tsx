import { ClerkLayout } from "~/components/layout";

export default function AppClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkLayout>{children}</ClerkLayout>;
}
