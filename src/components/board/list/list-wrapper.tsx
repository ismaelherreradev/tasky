type ListWrapperProps = {
  children: React.ReactNode;
};

export function ListWrapper({ children }: ListWrapperProps) {
  return (
    <li className="h-full w-[272px] shrink-0 list-none select-none">
      {children}
    </li>
  );
}
