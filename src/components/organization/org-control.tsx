import { useOrganizationList } from "@clerk/clerk-react"
import { useEffect } from "react"

type OrgControlProps = {
  id: string;
};

export function OrgControl({ id }: OrgControlProps) {
  const { setActive } = useOrganizationList()

  useEffect(() => {
    if (!setActive) return

    void setActive({
      organization: id,
    })
  }, [setActive, id])

  return null
}
