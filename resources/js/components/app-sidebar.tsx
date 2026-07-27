import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Newspaper,
    Clapperboard,
    MessageCircleMore,
    BadgeDollarSign,
    Inbox,
    Images,
    UsersRound,
    ShieldCheck
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import type { Auth } from '@/types/auth';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
];

const featureNavItems: NavItem[] = [
    {
        title: 'Berita',
        href: '/news',
        icon: Newspaper,
    },
    {
        title: 'Short Video',
        href: '/short-videos',
        icon: Clapperboard,
    },
    {
        title: 'Komentar',
        href: '/comments',
        icon: MessageCircleMore,
    },
    {
        title: 'Iklan',
        href: '/iklan',
        icon: BadgeDollarSign,
    },
    {
        title: 'Email',
        href: '/email',
        icon: Inbox,
    },
    {
        title: 'Galeri',
        href: '/gallery',
        icon: Images,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Manajemen User',
        href: '/users',
        icon: UsersRound,
    },
    {
        title: 'Role & Permission',
        href: '/roles',
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const permissions = auth?.permissions || [];
    const roles = auth?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');

    const filteredUserNavItems = userNavItems.filter((item) => {
        if (item.href === '/users') {
            return isSuperAdmin || permissions.includes('manage users');
        }
        if (item.href === '/roles') {
            return isSuperAdmin || permissions.includes('manage roles');
        }
        return true;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="pb-4 pt-5 px-4 mb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={featureNavItems} label="Fitur" />
                {filteredUserNavItems.length > 0 && (
                    <NavMain items={filteredUserNavItems} label="User Manage" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
