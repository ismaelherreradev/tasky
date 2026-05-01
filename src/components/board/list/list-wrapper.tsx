type ListWrapperProps = {
  children: React.ReactNode
}

export default function ListWrapper({ children }: ListWrapperProps) {
  return <li className="h-full w-68 shrink-0 list-none select-none">{children}</li>
}
