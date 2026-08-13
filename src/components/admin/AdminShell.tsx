import { Link, useRouter } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  Building2,
  FolderTree,
  Gauge,
  HelpCircle,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  Sparkles,
  Users,
  Handshake,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ROLE_LABELS } from "@/services/auth";
import { authService, type Permission } from "@/services/auth";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  permission: Permission;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const ADMIN_NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard, permission: "logs:view" },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { label: "Products", to: "/admin/products", icon: Package, permission: "products:manage" },
      { label: "Categories", to: "/admin/categories", icon: FolderTree, permission: "products:manage" },
      { label: "Solutions", to: "/admin/solutions", icon: Boxes, permission: "content:manage" },
      { label: "Industries", to: "/admin/industries", icon: Building2, permission: "content:manage" },
      { label: "Projects", to: "/admin/projects", icon: Gauge, permission: "content:manage" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Team", to: "/admin/team", icon: Users, permission: "content:manage" },
      { label: "Partners", to: "/admin/partners", icon: Handshake, permission: "content:manage" },
      { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquareQuote, permission: "content:manage" },
      { label: "Statistics", to: "/admin/statistics", icon: Activity, permission: "content:manage" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { label: "Inquiries", to: "/admin/inquiries", icon: Inbox, permission: "leads:view" },
      { label: "FAQs", to: "/admin/faqs", icon: HelpCircle, permission: "content:manage" },
      { label: "Assistant knowledge", to: "/admin/knowledge", icon: Sparkles, permission: "chatbot:manage" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Media library", to: "/admin/media", icon: Image, permission: "media:manage" },
      { label: "Settings", to: "/admin/settings", icon: Settings, permission: "settings:manage" },
      { label: "Activity log", to: "/admin/logs", icon: Activity, permission: "logs:view" },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { can } = useAdminAuth();

  return (
    <nav className="space-y-6">
      {ADMIN_NAV.map((group) => {
        const items = group.items.filter((item) => can(item.permission));
        if (items.length === 0) return null;
        return (
          <div key={group.title}>
            <p className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {group.title}
            </p>
            <ul className="mt-2 space-y-0.5">
              {items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    activeOptions={{ exact: item.to === "/admin" }}
                    activeProps={{ className: "bg-primary/10 text-primary" }}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { email, roles } = useAdminAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    await authService.signOut();
    await router.navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[image:var(--gradient-brand)] font-display text-xs font-bold text-cyan-foreground">
            CI
          </span>
          <span className="font-display text-sm font-bold">
            CORE<span className="text-cyan">IP</span> Admin
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-5">
          <NavLinks />
        </div>
        <div className="border-t border-border p-4">
          <p className="truncate text-xs font-medium text-foreground">{email ?? "Signed in"}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {roles.map((role) => (
              <Badge key={role} variant="secondary" className="text-[0.65rem]">
                {ROLE_LABELS[role]}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full justify-start" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto p-5">
                <SheetTitle className="mb-5 font-display">CoreIP Admin</SheetTitle>
                <NavLinks onNavigate={() => setMobileOpen(false)} />
                <Button variant="ghost" size="sm" className="mt-6 w-full justify-start" onClick={signOut}>
                  <LogOut className="size-4" /> Sign out
                </Button>
              </SheetContent>
            </Sheet>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              View website
            </Link>
          </div>
        </header>
        <main className="px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}