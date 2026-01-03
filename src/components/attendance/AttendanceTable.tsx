import { useState } from 'react';
import { Student } from '@/types/attendance';
import { calculateStudentStats, isValidMobileNumber } from '@/utils/attendance';
import { Edit2, Trash2, AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AttendanceTableProps {
  students: Student[];
  onUpdateAttendance: (studentId: string, day: number, status: 'P' | 'A' | 'L' | '') => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onPermanentAbsentWarning?: (studentId: string) => void;
}

export const AttendanceTable = ({
  students,
  onUpdateAttendance,
  onEditStudent,
  onDeleteStudent,
  onPermanentAbsentWarning,
}: AttendanceTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const activeStudents = students.filter(s => !s.isPermanentAbsent);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const cycleStatus = (current: 'P' | 'A' | 'L' | '' | undefined): 'P' | 'A' | 'L' | '' => {
    const order: ('P' | 'A' | 'L' | '')[] = ['', 'P', 'A', 'L'];
    const currentIndex = order.indexOf(current || '');
    return order[(currentIndex + 1) % order.length];
  };

  const getStatusClass = (status: 'P' | 'A' | 'L' | '' | undefined) => {
    switch (status) {
      case 'P': return 'attendance-present';
      case 'A': return 'attendance-absent';
      case 'L': return 'attendance-leave';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDeleteStudent(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleAttendanceClick = (studentId: string, day: number, currentStatus: 'P' | 'A' | 'L' | '' | undefined) => {
    const newStatus = cycleStatus(currentStatus);
    onUpdateAttendance(studentId, day, newStatus);
    
    // Check if this makes it 5 absents and call the warning handler
    if (newStatus === 'A' && onPermanentAbsentWarning) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const updatedAttendance = { ...student.attendance, [day]: newStatus };
        const absentCount = Object.values(updatedAttendance).filter(s => s === 'A').length;
        if (absentCount === 5) {
          onPermanentAbsentWarning(studentId);
        }
      }
    }
  };

  // Handle mobile number click-to-call (double-tap for mobile)
  const handleMobileClick = (mobileNumber: string) => {
    window.location.href = `tel:${mobileNumber}`;
  };

  if (activeStudents.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">No students in this class yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Add students to start marking attendance.</p>
      </div>
    );
  }

  return (
    <>
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="sticky left-0 z-20 bg-primary px-3 py-3 text-left font-semibold">#</th>
                <th className="sticky left-10 z-20 bg-primary px-3 py-3 text-left font-semibold min-w-[120px]">Name</th>
                <th className="sticky left-[170px] z-20 bg-primary px-3 py-3 text-left font-semibold min-w-[120px]">Father</th>
                <th className="px-3 py-3 text-left font-semibold min-w-[100px]">Mobile</th>
                <th className="px-3 py-3 text-left font-semibold min-w-[80px]">Reg #</th>
                <th className="px-3 py-3 text-center font-semibold">Fee</th>
                {days.map(day => (
                  <th key={day} className="px-1 py-3 text-center font-semibold min-w-[36px]">
                    {day}
                  </th>
                ))}
                <th className="px-2 py-3 text-center font-semibold bg-success/20">P</th>
                <th className="px-2 py-3 text-center font-semibold bg-destructive/20">A</th>
                <th className="px-2 py-3 text-center font-semibold bg-warning/20">L</th>
                <th className="px-3 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeStudents.map((student, index) => {
                const stats = calculateStudentStats(student);
                const mobileInvalid = !isValidMobileNumber(student.mobileNumber);

                return (
                  <tr
                    key={student.id}
                    className={`border-b border-border/50 hover:bg-secondary/50 transition-colors ${
                      !student.feesPaid ? 'fee-unpaid' : ''
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-card px-3 py-2 font-medium">
                      {index + 1}
                    </td>
                    <td className="sticky left-10 z-10 bg-card px-3 py-2 font-medium">
                      {student.firstName}
                    </td>
                    <td className="sticky left-[170px] z-10 bg-card px-3 py-2">
                      {student.fatherName}
                    </td>
                    <td className={`px-3 py-2 ${mobileInvalid ? 'mobile-warning' : ''}`}>
                      <button
                        onDoubleClick={() => handleMobileClick(student.mobileNumber)}
                        className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                        title="Double-tap to call"
                      >
                        <Phone className="w-3 h-3 hidden sm:inline" />
                        {student.mobileNumber}
                      </button>
                    </td>
                    <td className="px-3 py-2">{student.registrationNumber}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        student.feesPaid 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {student.feesPaid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    {days.map(day => (
                      <td key={day} className="px-1 py-2 text-center">
                        <button
                          onClick={() => handleAttendanceClick(
                            student.id,
                            day,
                            student.attendance[day]
                          )}
                          className={`w-8 h-8 rounded-md text-xs font-bold transition-all hover:scale-110 ${getStatusClass(student.attendance[day])}`}
                        >
                          {student.attendance[day] || '-'}
                        </button>
                      </td>
                    ))}
                    <td className="px-2 py-2 text-center font-bold text-success">{stats.present}</td>
                    <td className="px-2 py-2 text-center font-bold text-destructive">{stats.absent}</td>
                    <td className="px-2 py-2 text-center font-bold text-warning">{stats.leave}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(student.id)}
                          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Delete Student</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground">
            Are you sure you want to delete this student? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
