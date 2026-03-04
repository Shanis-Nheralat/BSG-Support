import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import BackToTop from "@/components/ui/BackToTop";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main id="main-content" className="flex-1">{children}</main>
      <PublicFooter />
      <BackToTop />
    </div>
  );
}
