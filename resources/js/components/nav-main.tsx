import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items = [],
    label = 'Platform',
}: {
    items: NavItem[];
    label?: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-1">
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1 ml-1">{label}</SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="rounded-xl transition-all duration-300 hover:bg-sidebar-accent/80 hover:translate-x-1 hover:shadow-sm"
                        >
                            <Link href={item.href} prefetch className="flex items-center gap-3 py-2">
                                {item.icon && <item.icon className="size-4.5 opacity-80" />}
                                <span className="font-medium text-[14px]">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
