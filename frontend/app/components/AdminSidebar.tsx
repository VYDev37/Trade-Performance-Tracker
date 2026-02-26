"use client"

import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppConfig } from "@/app/app.config";
import { useUser } from "@/app/context/UserContext";

interface SidebarMenus {
    label: string;
    link: string;
    icon: string;
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useUser();

    const menus: SidebarMenus[] = [
        { label: "Dashboard", link: "/admin/dashboard", icon: "fa-gauge-high" },
        { label: "Stocks", link: "/admin/stocks", icon: "fa-arrow-trend-up" },
        { label: "AI Assistant", link: "/admin/assistant", icon: "fa-question" },
        { label: "Transactions", link: "/admin/transactions", icon: "fa-money-bill-transfer" },
        { label: "User Profile", link: "/admin/profile", icon: "fa-user" }
    ];

    return (
        <Sidebar collapsible="icon" className="border-r border-white/5 !bg-gray-900">
            <SidebarHeader className="h-20 border-b border-white/5 flex flex-row items-center px-6 gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                    <i className="fas fa-code text-xs"></i>
                </div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
                    {AppConfig.appName}
                </span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-500 font-bold uppercase text-[10px] tracking-[2px] px-6 mt-6 mb-2 group-data-[collapsible=icon]:hidden">
                        Management
                    </SidebarGroupLabel>
                    <SidebarMenu className="px-3 gap-1">
                        {menus.map((menu) => {
                            const isActive = pathname === menu.link;
                            return (
                                <SidebarMenuItem key={menu.link}>
                                    <SidebarMenuButton asChild tooltip={menu.label} isActive={isActive}
                                        className={`h-11 px-4 transition-all duration-200 group-data-[collapsible=icon]:justify-center ${isActive
                                            ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                                        <Link href={menu.link} className="flex items-center gap-3">
                                            <i className={`fas ${menu.icon} ${isActive ? 'text-blue-400' : 'text-gray-500'}`}></i>
                                            <span className="font-medium">{menu.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-white/5 bg-gray-950/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Sign Out" className="h-11 w-full justify-start gap-3 px-4 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                            <button onClick={logout}>
                                <i className="fas fa-right-from-bracket"></i>
                                <span className="font-medium group-data-[collapsible=icon]:hidden">Sign Out</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}