import { useState } from 'react';
import { ArchivedMonth } from '@/types/attendance';
import { calculateStudentStats } from '@/utils/attendance';
import { Archive, Eye, Download, Calendar, Clock, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArchivedMonthsProps {
  archivedMonths: ArchivedMonth[];
  className: string;
}

export const ArchivedMonths = ({ archivedMonths, className }: ArchivedMonthsProps) => {
  const [selectedArchive, setSelectedArchive] = useState<ArchivedMonth | null>(null);

  const handleDownloadReport = (archive: ArchivedMonth) => {
    const content = generateReportContent(archive);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${className}-${archive.month}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportContent = (archive: ArchivedMonth): string => {
    let content = `PRINCETON Course Attendance System\n`;
    content += `Monthly Report - ${archive.month}\n`;
    content += `${'='.repeat(50)}\n\n`;
    content += `Class: ${className}\n`;
    content += `Month: ${archive.month}\n`;
    content += `Start Date: ${archive.startDateAfghan} (${archive.startDateGregorian})\n`;
    content += `End Date: ${archive.endDateAfghan} (${archive.endDateGregorian})\n`;
    content += `Timing: ${archive.startTime} - ${archive.endTime}\n`;
    content += `Speaking Teacher: ${archive.speakingTeacher}\n`;
    content += `Grammar Teacher: ${archive.grammarTeacher}\n`;
    content += `Total Students: ${archive.totalStudents}\n\n`;
    
    content += `STUDENT ATTENDANCE\n`;
    content += `${'-'.repeat(50)}\n`;
    
    archive.students.filter(s => !s.isPermanentAbsent).forEach((student, index) => {
      const stats = calculateStudentStats(student);
      content += `${index + 1}. ${student.firstName} (${student.fatherName})\n`;
      content += `   Reg: ${student.registrationNumber} | Mobile: ${student.mobileNumber}\n`;
      content += `   Present: ${stats.present} | Absent: ${stats.absent} | Leave: ${stats.leave}\n`;
      content += `   Fee Paid: ${student.feesPaid ? 'Yes' : 'No'}\n\n`;
    });

    if (archive.permanentAbsentList.length > 0) {
      content += `\nPERMANENT ABSENT LIST\n`;
      content += `${'-'.repeat(50)}\n`;
      archive.permanentAbsentList.forEach((student, index) => {
        content += `${index + 1}. ${student.firstName} - ${student.fatherName} - ${student.mobileNumber}\n`;
      });
    }

    return content;
  };

  if (archivedMonths.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">No archived months yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Archives are created when you start a new month
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card-elevated p-6">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Archive className="w-5 h-5 text-primary" />
          Archived Months
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivedMonths.map((archive) => (
            <div
              key={archive.id}
              className="bg-secondary/50 rounded-xl p-4 border border-border/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg">{archive.month}</h4>
                <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                  {new Date(archive.archivedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{archive.startDateAfghan} - {archive.endDateAfghan}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{archive.startTime} - {archive.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{archive.totalStudents} students</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedArchive(archive)}
                  className="flex-1 gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport(archive)}
                  className="flex-1 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Archive Detail Dialog */}
      <Dialog open={!!selectedArchive} onOpenChange={() => setSelectedArchive(null)}>
        <DialogContent className="bg-card max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Archive className="w-5 h-5 text-primary" />
              {selectedArchive?.month} - Archived Data
            </DialogTitle>
          </DialogHeader>

          {selectedArchive && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-4">
                {/* Class Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">{selectedArchive.startDateAfghan}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">End Date:</span>
                    <p className="font-medium">{selectedArchive.endDateAfghan}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Speaking Teacher:</span>
                    <p className="font-medium">{selectedArchive.speakingTeacher || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Grammar Teacher:</span>
                    <p className="font-medium">{selectedArchive.grammarTeacher || 'N/A'}</p>
                  </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="table-header">
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Father</th>
                        <th className="px-3 py-2 text-center">P</th>
                        <th className="px-3 py-2 text-center">A</th>
                        <th className="px-3 py-2 text-center">L</th>
                        <th className="px-3 py-2 text-center">Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedArchive.students.filter(s => !s.isPermanentAbsent).map((student, index) => {
                        const stats = calculateStudentStats(student);
                        return (
                          <tr key={student.id} className="border-b border-border/50">
                            <td className="px-3 py-2">{index + 1}</td>
                            <td className="px-3 py-2 font-medium">{student.firstName}</td>
                            <td className="px-3 py-2">{student.fatherName}</td>
                            <td className="px-3 py-2 text-center text-success font-bold">{stats.present}</td>
                            <td className="px-3 py-2 text-center text-destructive font-bold">{stats.absent}</td>
                            <td className="px-3 py-2 text-center text-warning font-bold">{stats.leave}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                student.feesPaid ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                              }`}>
                                {student.feesPaid ? 'Yes' : 'No'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Permanent Absent */}
                {selectedArchive.permanentAbsentList.length > 0 && (
                  <div>
                    <h4 className="font-bold text-destructive mb-3">Permanent Absent Students</h4>
                    <div className="space-y-2">
                      {selectedArchive.permanentAbsentList.map((student, index) => (
                        <div key={student.id} className="flex items-center gap-3 text-sm bg-destructive/5 p-2 rounded">
                          <span className="font-medium">{index + 1}.</span>
                          <span>{student.firstName}</span>
                          <span className="text-muted-foreground">- {student.fatherName}</span>
                          <span className="text-muted-foreground ml-auto">{student.mobileNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
