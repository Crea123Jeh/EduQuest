import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen md:peer-data-[state=expanded]:ml-[2rem] md:peer-data-[state=collapsed]:ml-[3rem] peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow transition-margin-left duration-200 ease-linear">
        <AppHeader />
        <main className="flex-1 mr-20 bg-muted/40 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
