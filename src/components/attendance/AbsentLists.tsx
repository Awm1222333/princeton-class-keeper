import { useState } from 'react';
import { Student } from '@/types/attendance';
import { getAbsentStudentsForDay, getPermanentAbsentStudents } from '@/utils/attendance';
import { UserX, AlertTriangle, Calendar, Phone, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AbsentListsProps {
  students: Student[];
  className: string;
}

export const AbsentLists = ({ students, className }: AbsentListsProps) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const dailyAbsent = getAbsentStudentsForDay(students, selectedDay);
  const permanentAbsent = getPermanentAbsentStudents(students);

  const handlePrint = (type: 'daily' | 'permanent') => {
    window.print();
  };

  const handleDownloadPDF = (type: 'daily' | 'permanent') => {
    // In a real implementation, you'd use a library like jsPDF
    const content = type === 'daily' 
      ? `Daily Absent List - Day ${selectedDay}\n\n${dailyAbsent.map((s, i) => `${i+1}. ${s.firstName} - ${s.fatherName} - ${s.mobileNumber}`).join('\n')}`
      : `Permanent Absent List\n\n${permanentAbsent.map((s, i) => `${i+1}. ${s.firstName} - ${s.fatherName} - ${s.mobileNumber}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-absent-list-${className}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Daily Absent
          </TabsTrigger>
          <TabsTrigger value="permanent" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Permanent Absent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Select Day:</span>
                <Select
                  value={selectedDay.toString()}
                  onValueChange={(v) => setSelectedDay(parseInt(v))}
                >
                  <SelectTrigger className="w-24 input-field">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-2 z-50">
                    {days.map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        Day {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 print-hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePrint('daily')}
                  className="gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadPDF('daily')}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>

            {dailyAbsent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserX className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No absent students on Day {selectedDay}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Father's Name</th>
                      <th className="px-4 py-3 text-left">Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyAbsent.map((student, index) => (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-secondary/50">
                        <td className="px-4 py-3 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{student.firstName}</td>
                        <td className="px-4 py-3">{student.fatherName}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {student.mobileNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permanent">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Students absent 5 or more days are automatically moved here
              </p>
              <div className="flex items-center gap-2 print-hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePrint('permanent')}
                  className="gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadPDF('permanent')}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>

            {permanentAbsent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No permanent absent students</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Father's Name</th>
                      <th className="px-4 py-3 text-left">Mobile</th>
                      <th className="px-4 py-3 text-left">Reg #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permanentAbsent.map((student, index) => (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-secondary/50 bg-destructive/5">
                        <td className="px-4 py-3 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-destructive">{student.firstName}</td>
                        <td className="px-4 py-3">{student.fatherName}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {student.mobileNumber}
                        </td>
                        <td className="px-4 py-3">{student.registrationNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
