import { CompanyList } from '@/components/CompanyList';
import { FolderTree } from '@/components/FolderTree';
import { DetailsPanel } from '@/components/DetailsPanel';
import { Boxes } from 'lucide-react';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Boxes className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Patrimônio</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          v1.0
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Companies */}
        <div className="w-56 shrink-0">
          <CompanyList />
        </div>

        {/* Center Column - Folder Tree */}
        <div className="w-72 shrink-0">
          <FolderTree />
        </div>

        {/* Right Column - Details Panel */}
        <div className="flex-1 min-w-0">
          <DetailsPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
