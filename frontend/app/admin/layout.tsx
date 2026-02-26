import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/app/components/AdminSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="bg-transparent">
            <AdminSidebar />
            <main className="relative flex-1 flex flex-col min-h-screen overflow-x-hidden">
                <div className="flex h-16 items-center px-4 border-b border-white/5">
                    <SidebarTrigger />
                </div>
                <div className="flex-1 mx-6 md:mx-10 w-full max-w-full">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}