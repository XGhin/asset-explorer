import { usePatrimonyStore } from '@/store/patrimonyStore';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumb() {
  const selectedFolderId = usePatrimonyStore((s) => s.selectedFolderId);
  const getPath = usePatrimonyStore((s) => s.getPath);
  const selectFolder = usePatrimonyStore((s) => s.selectFolder);

  if (!selectedFolderId) return null;

  const path = getPath(selectedFolderId);

  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto">
      {path.map((segment, index) => (
        <div key={segment.id} className="flex items-center gap-1 shrink-0">
          {index > 0 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <button
            onClick={() => selectFolder(segment.id)}
            className={cn(
              'px-2 py-1 rounded hover:bg-secondary transition-colors',
              index === path.length - 1
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {segment.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
