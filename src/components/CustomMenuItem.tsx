import Link from "next/link"
import { MenuItem } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

interface CustomMenuItemProps {
  children: React.ReactNode
  to?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const CustomMenuItem = ({
  children,
  to = "/",
  onClick,
}: CustomMenuItemProps) => {
  return (
    <Link href={to}>
      <MenuItem>
        <a onClick={onClick}>{children}</a>
      </MenuItem>
    </Link>
  )
}

export default CustomMenuItem
