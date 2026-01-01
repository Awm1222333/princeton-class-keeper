import { useState } from 'react';
import { ClassInfo } from '@/types/attendance';
import { generateId } from '@/utils/attendance';
import { Plus, Edit2, Trash2, ChevronDown, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ClassSelectorProps {
  classes: ClassInfo[];
  selectedClassId: string | null;
  onSelectClass: (id: string) => void;
  onCreateClass: (classInfo: ClassInfo) => void;
  onRenameClass: (id: string, newName: string) => void;
  onDeleteClass: (id: string) => void;
}

export const ClassSelector = ({
  classes,
  selectedClassId,
  onSelectClass,
  onCreateClass,
  onRenameClass,
  onDeleteClass,
}: ClassSelectorProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [classToModify, setClassToModify] = useState<string | null>(null);

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handleCreateClass = () => {
    if (!newClassName.trim()) {
      toast.error('Please enter a class name');
      return;
    }

    const newClass: ClassInfo = {
      id: generateId(),
      name: newClassName.trim(),
      month: 'Hamal',
      startDateAfghan: '',
      startDateGregorian: '',
      endDateAfghan: '',
      endDateGregorian: '',
      startTime: '',
      endTime: '',
      speakingTeacher: '',
      grammarTeacher: '',
      students: [],
      archivedMonths: [],
      createdAt: new Date().toISOString(),
    };

    onCreateClass(newClass);
    setNewClassName('');
    setIsCreateOpen(false);
    toast.success(`Class "${newClass.name}" created successfully`);
  };

  const handleRename = () => {
    if (!renameValue.trim() || !classToModify) {
      toast.error('Please enter a new name');
      return;
    }

    onRenameClass(classToModify, renameValue.trim());
    setRenameValue('');
    setClassToModify(null);
    setIsRenameOpen(false);
    toast.success('Class renamed successfully');
  };

  const handleDelete = () => {
    if (!classToModify) return;

    onDeleteClass(classToModify);
    setClassToModify(null);
    setIsDeleteOpen(false);
    toast.success('Class deleted successfully');
  };

  const openRenameDialog = (classId: string, currentName: string) => {
    setClassToModify(classId);
    setRenameValue(currentName);
    setIsRenameOpen(true);
  };

  const openDeleteDialog = (classId: string) => {
    setClassToModify(classId);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="min-w-[200px] justify-between bg-card border-2 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-primary" />
              <span className="truncate">
                {selectedClass ? selectedClass.name : 'Select a Class'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[250px] bg-card border-2 border-border shadow-elevated z-50"
          align="start"
        >
          {classes.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              No classes yet. Create one!
            </div>
          ) : (
            classes.map(cls => (
              <DropdownMenuItem
                key={cls.id}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-secondary"
                onClick={() => onSelectClass(cls.id)}
              >
                <span className={selectedClassId === cls.id ? 'font-semibold text-primary' : ''}>
                  {cls.name}
                </span>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <button
                    className="p-1 hover:bg-primary/10 rounded transition-colors"
                    onClick={() => openRenameDialog(cls.id, cls.name)}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                  </button>
                  <button
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    onClick={() => openDeleteDialog(cls.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={() => setIsCreateOpen(true)}
        className="btn-accent gap-2"
      >
        <Plus className="w-4 h-4" />
        New Class
      </Button>

      {/* Create Class Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Class</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter class name..."
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="input-field"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClass} className="btn-primary">
              Create Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Rename Class</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter new name..."
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="input-field"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} className="btn-primary">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Delete Class</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground">
            Are you sure you want to delete this class? This action cannot be undone and all data will be lost.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
