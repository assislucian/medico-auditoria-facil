
import {
  LayoutDashboard,
  UploadCloud,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  AlertTriangle
} from "lucide-react"

import { MainNavItem } from "@/types"

interface MainNavigationProps {
  items?: MainNavItem[]
}

export function MainNavigation({ items }: MainNavigationProps) {
  return (
    <div className="flex flex-col space-y-1">
      {MainNavigationItems.map(item => (
        <NavItem
          key={item.href}
          href={item.href}
          title={item.name}
          icon={item.icon}
        />
      ))}
      {items?.length ? (
        <>
          <div className="border-b border-border/10" />
          {items?.map((item) => (
            item.href ? (
              <NavItem
                key={item.href}
                href={item.href}
                title={item.name}
                icon={item.icon}
              />
            ) : null
          ))}
        </>
      ) : null}
    </div>
  )
}

interface NavItemProps {
  href: string
  title: string
  icon: React.ComponentType<any>
}

function NavItem({ href, title, icon: Icon }: NavItemProps) {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{title}</span>
    </a>
  )
}

const MainNavigationItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    name: "Uploads", 
    href: "/uploads", 
    icon: UploadCloud 
  },
  { 
    name: "Histórico", 
    href: "/history", 
    icon: History 
  },
  {
    name: "Divergências",
    href: "/divergences",
    icon: AlertTriangle
  },
  { 
    name: "Relatórios", 
    href: "/reports", 
    icon: BarChart3
  }
];
