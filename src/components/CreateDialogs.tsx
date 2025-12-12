import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePatrimonyStore } from '@/store/patrimonyStore';
import { EXPENSE_CATEGORIES } from '@/types/patrimony';
import { FolderPlus, Package, Receipt } from 'lucide-react';

interface CreateDialogsProps {
  openDialog: 'folder' | 'item' | 'expense' | null;
  onClose: () => void;
}

export function CreateDialogs({ openDialog, onClose }: CreateDialogsProps) {
  const selectedFolderId = usePatrimonyStore((s) => s.selectedFolderId);
  const addFolder = usePatrimonyStore((s) => s.addFolder);
  const addExpense = usePatrimonyStore((s) => s.addExpense);
  const getSelectedFolder = usePatrimonyStore((s) => s.getSelectedFolder);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setCategory('');
    setValue('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
  };

  const handleCreateFolder = () => {
    if (name.trim()) {
      addFolder(name.trim(), selectedFolderId, 'folder');
      resetForm();
      onClose();
    }
  };

  const handleCreateItem = () => {
    if (name.trim()) {
      addFolder(name.trim(), selectedFolderId, 'item');
      resetForm();
      onClose();
    }
  };

  const handleCreateExpense = () => {
    if (selectedFolderId && category && value && date) {
      addExpense({
        folderId: selectedFolderId,
        category,
        value: parseFloat(value),
        date: new Date(date),
        description: description.trim(),
      });
      resetForm();
      onClose();
    }
  };

  const selectedFolder = getSelectedFolder();

  return (
    <>
      {/* Create Folder Dialog */}
      <Dialog open={openDialog === 'folder'} onOpenChange={() => onClose()}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-folder-icon" />
              Nova Pasta
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Nome da pasta</Label>
              <Input
                id="folder-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Setor Administrativo"
                className="bg-input border-border"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
            </div>
            {selectedFolder && (
              <p className="text-sm text-muted-foreground">
                Será criada dentro de: <span className="text-foreground">{selectedFolder.name}</span>
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleCreateFolder} disabled={!name.trim()}>
                Criar Pasta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Item Dialog */}
      <Dialog open={openDialog === 'item'} onOpenChange={() => onClose()}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-item-icon" />
              Novo Item
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">Nome do item</Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: NOTEBOOK-01"
                className="bg-input border-border"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
              />
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Subpastas criadas automaticamente:</p>
              <div className="flex flex-wrap gap-2">
                {['Aquisição', 'Manutenção', 'Documentos', 'Upgrades'].map((sub) => (
                  <span key={sub} className="text-xs px-2 py-1 bg-muted rounded">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
            {selectedFolder && (
              <p className="text-sm text-muted-foreground">
                Será criado dentro de: <span className="text-foreground">{selectedFolder.name}</span>
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleCreateItem} disabled={!name.trim()}>
                Criar Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Expense Dialog */}
      <Dialog open={openDialog === 'expense'} onOpenChange={() => onClose()}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-expense-icon" />
              Nova Despesa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-value">Valor (R$)</Label>
                <Input
                  id="expense-value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0,00"
                  className="bg-input border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-date">Data</Label>
              <Input
                id="expense-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-description">Descrição</Label>
              <Textarea
                id="expense-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a despesa..."
                className="bg-input border-border resize-none"
                rows={3}
              />
            </div>
            {selectedFolder && (
              <p className="text-sm text-muted-foreground">
                Lançar em: <span className="text-foreground">{selectedFolder.name}</span>
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateExpense}
                disabled={!category || !value || !date}
              >
                Criar Despesa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
