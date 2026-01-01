import { useState } from 'react';
import { Student } from '@/types/attendance';
import { generateId, isValidMobileNumber } from '@/utils/attendance';
import { UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  editStudent?: Student | null;
  nextSerialNumber: number;
}

export const StudentForm = ({
  isOpen,
  onClose,
  onSave,
  editStudent,
  nextSerialNumber,
}: StudentFormProps) => {
  const [formData, setFormData] = useState<Partial<Student>>(
    editStudent || {
      firstName: '',
      fatherName: '',
      mobileNumber: '',
      registrationNumber: '',
      feesPaid: false,
      notes: '',
    }
  );

  const handleSubmit = () => {
    if (!formData.firstName?.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!formData.fatherName?.trim()) {
      toast.error("Father's name is required");
      return;
    }
    if (!formData.mobileNumber?.trim()) {
      toast.error('Mobile number is required');
      return;
    }
    if (!formData.registrationNumber?.trim()) {
      toast.error('Registration number is required');
      return;
    }

    const student: Student = {
      id: editStudent?.id || generateId(),
      serialNumber: editStudent?.serialNumber || nextSerialNumber,
      firstName: formData.firstName!.trim(),
      fatherName: formData.fatherName!.trim(),
      mobileNumber: formData.mobileNumber!.trim(),
      registrationNumber: formData.registrationNumber!.trim(),
      feesPaid: formData.feesPaid || false,
      notes: formData.notes?.trim() || '',
      attendance: editStudent?.attendance || {},
      isPermanentAbsent: editStudent?.isPermanentAbsent || false,
    };

    onSave(student);
    handleClose();
    toast.success(editStudent ? 'Student updated successfully' : 'Student added successfully');
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      fatherName: '',
      mobileNumber: '',
      registrationNumber: '',
      feesPaid: false,
      notes: '',
    });
    onClose();
  };

  const mobileIsInvalid = formData.mobileNumber && !isValidMobileNumber(formData.mobileNumber);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            {editStudent ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">First Name *</Label>
            <Input
              placeholder="Enter first name"
              value={formData.firstName || ''}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Father's Name *</Label>
            <Input
              placeholder="Enter father's name"
              value={formData.fatherName || ''}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Mobile Number *</Label>
            <Input
              placeholder="Enter mobile number"
              value={formData.mobileNumber || ''}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              className={`input-field ${mobileIsInvalid ? 'border-destructive text-destructive' : ''}`}
            />
            {mobileIsInvalid && (
              <p className="text-xs text-destructive">Mobile number must be at least 10 digits</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Registration Number *</Label>
            <Input
              placeholder="Enter registration number"
              value={formData.registrationNumber || ''}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="feesPaid"
              checked={formData.feesPaid || false}
              onCheckedChange={(checked) => setFormData({ ...formData, feesPaid: checked as boolean })}
            />
            <Label htmlFor="feesPaid" className="text-sm font-medium cursor-pointer">
              Fees Paid
            </Label>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              placeholder="Additional notes..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="btn-primary">
            {editStudent ? 'Update' : 'Add Student'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
