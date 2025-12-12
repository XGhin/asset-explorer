import { Building2 } from 'lucide-react';
import { usePatrimonyStore } from '@/store/patrimonyStore';
import { cn } from '@/lib/utils';

export function CompanyList() {
  const rootFolders = usePatrimonyStore((s) => s.getRootFolders());
  const selectedFolderId = usePatrimonyStore((s) => s.selectedFolderId);
  const selectFolder = usePatrimonyStore((s) => s.selectFolder);
  const toggleExpand = usePatrimonyStore((s) => s.toggleExpand);

  const handleSelect = (id: string) => {
    selectFolder(id);
    toggleExpand(id);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Empresas
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {rootFolders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => handleSelect(folder.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150',
              'hover:bg-sidebar-accent',
              selectedFolderId === folder.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground'
            )}
          >
            <Building2 className="h-4 w-4 text-folder-icon shrink-0" />
            <span className="text-sm font-medium truncate">{folder.name}</span>
          </button>
        ))}
        
        {rootFolders.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma empresa cadastrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
