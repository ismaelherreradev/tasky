type ListWrapperProps = {
  children: React.ReactNode;
};

export function ListWrapper({ children }: ListWrapperProps) {
  return <li className="h-full w-[272px] list-none shrink-0 select-none">{children}</li>;
}
