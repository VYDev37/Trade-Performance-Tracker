import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import InitStores from "@/app/admin/InitStores";
import { MigrationModal } from "@/components/shared";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="bg-transparent">
            <AdminSidebar />
            <main className="relative flex-1 flex flex-col min-h-screen overflow-x-hidden">
                <div className="flex h-16 items-center px-4 border-b border-white/5">
                    <SidebarTrigger />
                </div>
                <div className="flex-1 px-4 md:px-6 lg:px-10 w-full">
                    <InitStores />
                    <MigrationModal />
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}