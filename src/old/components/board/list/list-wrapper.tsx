type ListWrapperProps = {
  children: React.ReactNode;
};

export function ListWrapper({ children }: ListWrapperProps) {
  return (
    <li className="h-full w-[272px] shrink-0 select-none list-none">
      {children}
    </li>
  );
}
