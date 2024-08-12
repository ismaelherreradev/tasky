export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="isolate grid min-h-svh place-items-center">{children}</div>
  );
}
