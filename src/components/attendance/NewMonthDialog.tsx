import { ClassInfo, AFGHAN_MONTHS } from '@/types/attendance';
import { createArchivedMonth, resetForNewMonth } from '@/utils/attendance';
import { CalendarPlus, Archive, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface NewMonthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo;
  onConfirm: (newMonth: string, archivedMonth: any, resetStudents: any[]) => void;
}

export const NewMonthDialog = ({ isOpen, onClose, classInfo, onConfirm }: NewMonthDialogProps) => {
  const currentMonthIndex = AFGHAN_MONTHS.indexOf(classInfo.month as any);
  const nextMonthIndex = (currentMonthIndex + 1) % 12;
  const [selectedMonth, setSelectedMonth] = useState<string>(AFGHAN_MONTHS[nextMonthIndex]);

  const handleConfirm = () => {
    // Create archive of current month
    const archivedMonth = createArchivedMonth(classInfo);
    
    // Reset students for new month
    const resetStudents = resetForNewMonth(classInfo.students);
    
    onConfirm(selectedMonth, archivedMonth, resetStudents);
    toast.success(`Month archived! Starting ${selectedMonth}`);
    onClose();
  };

  const activeStudents = classInfo.students.filter(s => !s.isPermanentAbsent);
  const permanentAbsent = classInfo.students.filter(s => s.isPermanentAbsent);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-primary" />
            Start New Month
          </DialogTitle>
          <DialogDescription>
            This will archive the current month and start fresh
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/30">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">What will happen:</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Current month ({classInfo.month}) will be archived</li>
                <li>• All attendance will reset to zero</li>
                <li>• Fee status will reset to unpaid</li>
                <li>• Permanent absent list will clear</li>
                <li>• Student names & info will remain</li>
              </ul>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-secondary/50 p-3 rounded-lg">
              <p className="text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold">{activeStudents.length}</p>
            </div>
            <div className="bg-destructive/10 p-3 rounded-lg">
              <p className="text-muted-foreground">Permanent Absent</p>
              <p className="text-2xl font-bold text-destructive">{permanentAbsent.length}</p>
            </div>
          </div>

          {/* New Month Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select New Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="input-field">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-2 z-50">
                {AFGHAN_MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="btn-primary gap-2">
            <Archive className="w-4 h-4" />
            Archive & Start New Month
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
