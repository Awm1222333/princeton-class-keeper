import { ClassInfo, Student } from '@/types/attendance';
import { calculateStudentStats } from '@/utils/attendance';
import { 
  UserPlus, 
  Copy, 
  Download, 
  FileText,
  CalendarPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ActionButtonsProps {
  classInfo: ClassInfo;
  onAddStudent: () => void;
  onNewMonth: () => void;
}

export const ActionButtons = ({ classInfo, onAddStudent, onNewMonth }: ActionButtonsProps) => {
  const handleCopyTable = () => {
    const activeStudents = classInfo.students.filter(s => !s.isPermanentAbsent);
    let tableText = 'Serial\tName\tFather\tMobile\tReg #\tFee\tP\tA\tL\n';
    
    activeStudents.forEach((student, index) => {
      const stats = calculateStudentStats(student);
      tableText += `${index + 1}\t${student.firstName}\t${student.fatherName}\t${student.mobileNumber}\t${student.registrationNumber}\t${student.feesPaid ? 'Yes' : 'No'}\t${stats.present}\t${stats.absent}\t${stats.leave}\n`;
    });

    navigator.clipboard.writeText(tableText);
    toast.success('Table copied to clipboard');
  };

  const handleDownloadAttendancePDF = () => {
    const activeStudents = classInfo.students.filter(s => !s.isPermanentAbsent);
    let content = `PRINCETON Course Attendance System\n`;
    content += `Complete Attendance Record\n`;
    content += `${'='.repeat(70)}\n\n`;
    content += `Class: ${classInfo.name}\n`;
    content += `Month: ${classInfo.month}\n`;
    content += `Period: ${classInfo.startDateAfghan} to ${classInfo.endDateAfghan}\n`;
    content += `Timing: ${classInfo.startTime} - ${classInfo.endTime}\n`;
    content += `Speaking Teacher: ${classInfo.speakingTeacher}\n`;
    content += `Grammar Teacher: ${classInfo.grammarTeacher}\n`;
    content += `Total Students: ${activeStudents.length}\n\n`;

    content += `ATTENDANCE REGISTER\n`;
    content += `${'-'.repeat(70)}\n\n`;

    // Header row
    content += `#\tName\t\t\tFather\t\t\t`;
    for (let d = 1; d <= 30; d++) {
      content += `${d}\t`;
    }
    content += `P\tA\tL\n`;
    content += `${'-'.repeat(200)}\n`;

    activeStudents.forEach((student, index) => {
      const stats = calculateStudentStats(student);
      content += `${index + 1}\t${student.firstName.padEnd(16)}\t${student.fatherName.padEnd(16)}\t`;
      
      for (let day = 1; day <= 30; day++) {
        const status = student.attendance[day] || '-';
        content += `${status}\t`;
      }
      content += `${stats.present}\t${stats.absent}\t${stats.leave}\n`;
    });

    // Permanent absent list
    const permanentAbsent = classInfo.students.filter(s => s.isPermanentAbsent);
    if (permanentAbsent.length > 0) {
      content += `\n\nPERMANENT ABSENT LIST\n`;
      content += `${'-'.repeat(70)}\n`;
      permanentAbsent.forEach((student, index) => {
        content += `${index + 1}. ${student.firstName} - ${student.fatherName} | Mobile: ${student.mobileNumber}\n`;
      });
    }

    content += `\n\n${'='.repeat(70)}\n`;
    content += `Administrator: Aziz Ahmad\n`;
    content += `Developed by: Mosa Khan\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classInfo.name}-${classInfo.month}-attendance.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Attendance PDF downloaded');
  };

  const handleDownloadMonthlyPDF = () => {
    const activeStudents = classInfo.students.filter(s => !s.isPermanentAbsent);
    let content = `PRINCETON Course Attendance System\n`;
    content += `Monthly Attendance Report\n`;
    content += `${'='.repeat(60)}\n\n`;
    content += `Class: ${classInfo.name}\n`;
    content += `Month: ${classInfo.month}\n`;
    content += `Period: ${classInfo.startDateAfghan} to ${classInfo.endDateAfghan}\n`;
    content += `Timing: ${classInfo.startTime} - ${classInfo.endTime}\n`;
    content += `Speaking Teacher: ${classInfo.speakingTeacher}\n`;
    content += `Grammar Teacher: ${classInfo.grammarTeacher}\n`;
    content += `Total Students: ${activeStudents.length}\n\n`;

    content += `ATTENDANCE DETAILS\n`;
    content += `${'-'.repeat(60)}\n\n`;

    activeStudents.forEach((student, index) => {
      const stats = calculateStudentStats(student);
      content += `${index + 1}. ${student.firstName} (${student.fatherName})\n`;
      content += `   Registration: ${student.registrationNumber}\n`;
      content += `   Mobile: ${student.mobileNumber}\n`;
      content += `   Fee Status: ${student.feesPaid ? 'Paid' : 'Unpaid'}\n`;
      content += `   Attendance: P=${stats.present} | A=${stats.absent} | L=${stats.leave}\n`;
      
      // Daily attendance
      let attendanceStr = '   Days: ';
      for (let day = 1; day <= 30; day++) {
        const status = student.attendance[day] || '-';
        attendanceStr += `${day}:${status} `;
        if (day % 10 === 0 && day < 30) attendanceStr += '\n         ';
      }
      content += attendanceStr + '\n\n';
    });

    // Permanent absent list
    const permanentAbsent = classInfo.students.filter(s => s.isPermanentAbsent);
    if (permanentAbsent.length > 0) {
      content += `\nPERMANENT ABSENT LIST\n`;
      content += `${'-'.repeat(60)}\n`;
      permanentAbsent.forEach((student, index) => {
        content += `${index + 1}. ${student.firstName} - ${student.fatherName}\n`;
        content += `   Mobile: ${student.mobileNumber}\n`;
      });
    }

    content += `\n\n${'='.repeat(60)}\n`;
    content += `Administrator: Aziz Ahmad\n`;
    content += `Developed by: Mosa Khan\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classInfo.name}-${classInfo.month}-full-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Monthly report downloaded');
  };

  return (
    <div className="flex flex-wrap gap-3 print-hidden">
      <Button onClick={onAddStudent} className="btn-accent gap-2">
        <UserPlus className="w-4 h-4" />
        Add Student
      </Button>

      <Button onClick={onNewMonth} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
        <CalendarPlus className="w-4 h-4" />
        New Month
      </Button>

      <Button onClick={handleCopyTable} variant="outline" className="gap-2">
        <Copy className="w-4 h-4" />
        Copy Table
      </Button>

      <Button onClick={handleDownloadMonthlyPDF} variant="outline" className="gap-2">
        <FileText className="w-4 h-4" />
        Download Report
      </Button>

      <Button onClick={handleDownloadAttendancePDF} variant="outline" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Download className="w-4 h-4" />
        Download Attendance PDF
      </Button>
    </div>
  );
};
