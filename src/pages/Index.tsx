import { useState, useEffect } from 'react';
import { ClassInfo, Student, ArchivedMonth } from '@/types/attendance';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  calculateClassStats,
  checkPermanentAbsent,
  sortStudentsAlphabetically,
} from '@/utils/attendance';
import { Header } from '@/components/attendance/Header';
import { ClassSelector } from '@/components/attendance/ClassSelector';
import { ClassInfoForm } from '@/components/attendance/ClassInfoForm';
import { StatsCards } from '@/components/attendance/StatsCards';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { StudentForm } from '@/components/attendance/StudentForm';
import { ActionButtons } from '@/components/attendance/ActionButtons';
import { AbsentLists } from '@/components/attendance/AbsentLists';
import { ArchivedMonths } from '@/components/attendance/ArchivedMonths';
import { NewMonthDialog } from '@/components/attendance/NewMonthDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  UserX, 
  Archive, 
  LayoutDashboard,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';

const Index = () => {
  const [classes, setClasses] = useLocalStorage<ClassInfo[]>('princeton-classes', []);
  const [selectedClassId, setSelectedClassId] = useLocalStorage<string | null>('princeton-selected-class', null);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isNewMonthOpen, setIsNewMonthOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [permanentAbsentWarning, setPermanentAbsentWarning] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const stats = selectedClass ? calculateClassStats(selectedClass.students) : null;

  const handleCreateClass = (newClass: ClassInfo) => {
    setClasses([...classes, newClass]);
    setSelectedClassId(newClass.id);
  };

  const handleRenameClass = (id: string, newName: string) => {
    setClasses(classes.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    if (selectedClassId === id) {
      setSelectedClassId(classes.length > 1 ? classes[0].id : null);
    }
  };

  const handleUpdateClassInfo = (updates: Partial<ClassInfo>) => {
    if (!selectedClassId) return;
    setClasses(classes.map(c => c.id === selectedClassId ? { ...c, ...updates } : c));
  };

  const handleSaveStudent = (student: Student) => {
    if (!selectedClassId) return;

    setClasses(classes.map(c => {
      if (c.id !== selectedClassId) return c;

      let updatedStudents: Student[];
      if (editingStudent) {
        updatedStudents = c.students.map(s => s.id === student.id ? student : s);
      } else {
        updatedStudents = [...c.students, student];
      }

      return { ...c, students: sortStudentsAlphabetically(updatedStudents) };
    }));

    setEditingStudent(null);
  };

  const handleUpdateAttendance = (studentId: string, day: number, status: 'P' | 'A' | 'L' | '') => {
    if (!selectedClassId) return;

    setClasses(classes.map(c => {
      if (c.id !== selectedClassId) return c;

      const updatedStudents = c.students.map(s => {
        if (s.id !== studentId) return s;

        const updatedStudent = {
          ...s,
          attendance: { ...s.attendance, [day]: status },
        };

        // Don't auto-set permanent absent - let the warning dialog handle it
        return updatedStudent;
      });

      return { ...c, students: updatedStudents };
    }));
  };

  const handlePermanentAbsentWarning = (studentId: string) => {
    setPermanentAbsentWarning(studentId);
  };

  const handleConfirmPermanentAbsent = (confirm: boolean) => {
    if (confirm && permanentAbsentWarning && selectedClassId) {
      setClasses(classes.map(c => {
        if (c.id !== selectedClassId) return c;
        return {
          ...c,
          students: c.students.map(s => 
            s.id === permanentAbsentWarning ? { ...s, isPermanentAbsent: true } : s
          ),
        };
      }));
    }
    setPermanentAbsentWarning(null);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentFormOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!selectedClassId) return;

    setClasses(classes.map(c => {
      if (c.id !== selectedClassId) return c;
      return { ...c, students: c.students.filter(s => s.id !== studentId) };
    }));
  };

  const handleNewMonth = (newMonth: string, archivedMonth: ArchivedMonth, resetStudents: Student[]) => {
    if (!selectedClassId) return;

    setClasses(classes.map(c => {
      if (c.id !== selectedClassId) return c;
      return {
        ...c,
        month: newMonth,
        archivedMonths: [...c.archivedMonths, archivedMonth],
        students: resetStudents,
        startDateAfghan: '',
        startDateGregorian: '',
        endDateAfghan: '',
        endDateGregorian: '',
      };
    }));
  };

  const nextSerialNumber = selectedClass 
    ? Math.max(0, ...selectedClass.students.map(s => s.serialNumber)) + 1 
    : 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Online/Offline Status */}
        <div className={`mb-4 flex items-center gap-2 text-sm ${isOnline ? 'text-success' : 'text-warning'}`}>
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Online - All data synced to localStorage</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Offline - Working locally</span>
            </>
          )}
        </div>

        {/* Class Selector */}
        <div className="mb-8">
          <ClassSelector
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            onCreateClass={handleCreateClass}
            onRenameClass={handleRenameClass}
            onDeleteClass={handleDeleteClass}
          />
        </div>

        {selectedClass ? (
          <div className="space-y-8">
            {/* Class Info Form */}
            <ClassInfoForm
              classInfo={selectedClass}
              onUpdate={handleUpdateClassInfo}
            />

            {/* Stats Cards */}
            {stats && <StatsCards stats={stats} />}

            {/* Action Buttons */}
            <ActionButtons
              classInfo={selectedClass}
              onAddStudent={() => {
                setEditingStudent(null);
                setIsStudentFormOpen(true);
              }}
              onNewMonth={() => setIsNewMonthOpen(true)}
            />

            {/* Tabs for different views */}
            <Tabs defaultValue="attendance" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 print-hidden">
                <TabsTrigger value="attendance" className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden sm:inline">Attendance</span>
                </TabsTrigger>
                <TabsTrigger value="absent" className="flex items-center gap-2">
                  <UserX className="w-4 h-4" />
                  <span className="hidden sm:inline">Absent Lists</span>
                </TabsTrigger>
                <TabsTrigger value="archive" className="flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  <span className="hidden sm:inline">Archives</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Statistics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="attendance" className="animate-fade-in">
                <AttendanceTable
                  students={selectedClass.students}
                  onUpdateAttendance={handleUpdateAttendance}
                  onEditStudent={handleEditStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onPermanentAbsentWarning={handlePermanentAbsentWarning}
                />
              </TabsContent>

              <TabsContent value="absent" className="animate-fade-in">
                <AbsentLists 
                  students={selectedClass.students} 
                  className={selectedClass.name}
                />
              </TabsContent>

              <TabsContent value="archive" className="animate-fade-in">
                <ArchivedMonths 
                  archivedMonths={selectedClass.archivedMonths}
                  className={selectedClass.name}
                />
              </TabsContent>

              <TabsContent value="stats" className="animate-fade-in">
                <ClassStatistics classInfo={selectedClass} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="card-elevated p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to PRINCETON</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Get started by creating your first class. All data is stored locally in your browser 
              and works completely offline.
            </p>
            <p className="text-sm text-muted-foreground">
              Administrator: <span className="font-semibold text-primary">Aziz Ahmad</span>
            </p>
          </div>
        )}

        {/* Student Form Dialog */}
        <StudentForm
          isOpen={isStudentFormOpen}
          onClose={() => {
            setIsStudentFormOpen(false);
            setEditingStudent(null);
          }}
          onSave={handleSaveStudent}
          editStudent={editingStudent}
          nextSerialNumber={nextSerialNumber}
        />

        {/* New Month Dialog */}
        {selectedClass && (
          <NewMonthDialog
            isOpen={isNewMonthOpen}
            onClose={() => setIsNewMonthOpen(false)}
            classInfo={selectedClass}
            onConfirm={handleNewMonth}
          />
        )}
      </main>

      {/* Permanent Absent Warning Dialog */}
      <Dialog open={!!permanentAbsentWarning} onOpenChange={() => setPermanentAbsentWarning(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-warning flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Permanent Absent Warning
            </DialogTitle>
          </DialogHeader>
          <p className="py-4 text-muted-foreground">
            This student has been absent for 5 days and is about to become a <strong>Permanent Absent</strong> student.
          </p>
          <p className="text-sm text-muted-foreground">
            Do you want to move this student to the Permanent Absent List?
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleConfirmPermanentAbsent(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleConfirmPermanentAbsent(true)}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              Yes, Move to Permanent Absent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12 print-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>PRINCETON Course Attendance System</p>
          <p className="mt-1">Developed for Language Institutes & Training Centers</p>
          <p className="mt-1">Administrator: <span className="font-semibold">Aziz Ahmad</span> | Developed by: <span className="font-semibold text-primary">Mosa Khan</span></p>
        </div>
      </footer>
    </div>
  );
};

// Class Statistics Component
const ClassStatistics = ({ classInfo }: { classInfo: ClassInfo }) => {
  const activeStudents = classInfo.students.filter(s => !s.isPermanentAbsent);
  const permanentAbsent = classInfo.students.filter(s => s.isPermanentAbsent);
  const stats = calculateClassStats(classInfo.students);

  // Calculate daily attendance
  const dailyStats = Array.from({ length: 30 }, (_, day) => {
    let present = 0;
    let absent = 0;
    let leave = 0;

    activeStudents.forEach(student => {
      const status = student.attendance[day + 1];
      if (status === 'P') present++;
      else if (status === 'A') absent++;
      else if (status === 'L') leave++;
    });

    return { day: day + 1, present, absent, leave };
  });

  const feeStats = {
    paid: classInfo.students.filter(s => s.feesPaid).length,
    unpaid: classInfo.students.filter(s => !s.feesPaid).length,
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          Class Statistics Overview
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-secondary/50 rounded-xl">
            <p className="text-3xl font-bold text-primary">{classInfo.students.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Enrolled</p>
          </div>
          <div className="text-center p-4 bg-success/10 rounded-xl">
            <p className="text-3xl font-bold text-success">{activeStudents.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Active Students</p>
          </div>
          <div className="text-center p-4 bg-destructive/10 rounded-xl">
            <p className="text-3xl font-bold text-destructive">{permanentAbsent.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Permanent Absent</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-xl">
            <p className="text-3xl font-bold text-primary">{stats.averageAttendance.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground mt-1">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Fee Statistics */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-bold mb-6">Fee Collection Status</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-success">{feeStats.paid}</span>
            </div>
            <div>
              <p className="font-medium">Fees Paid</p>
              <p className="text-sm text-muted-foreground">
                {((feeStats.paid / classInfo.students.length) * 100 || 0).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-destructive">{feeStats.unpaid}</span>
            </div>
            <div>
              <p className="font-medium">Fees Unpaid</p>
              <p className="text-sm text-muted-foreground">
                {((feeStats.unpaid / classInfo.students.length) * 100 || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        {/* Fee progress bar */}
        <div className="mt-6">
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${(feeStats.paid / classInfo.students.length) * 100 || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Attendance Chart (simplified) */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-bold mb-6">Daily Attendance Summary</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {dailyStats.map(day => {
              const total = day.present + day.absent + day.leave;
              const percentage = total > 0 ? (day.present / total) * 100 : 0;
              
              return (
                <div key={day.day} className="flex flex-col items-center">
                  <div 
                    className="w-6 rounded-t transition-all"
                    style={{
                      height: `${Math.max(20, percentage)}px`,
                      backgroundColor: percentage >= 80 ? 'hsl(var(--success))' : 
                                       percentage >= 60 ? 'hsl(var(--warning))' : 
                                       'hsl(var(--destructive))',
                      opacity: total > 0 ? 1 : 0.2,
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded" />
            <span>80%+ Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded" />
            <span>60-79% Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded" />
            <span>&lt;60% Present</span>
          </div>
        </div>
      </div>

      {/* Archive Summary */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-bold mb-6">Archive Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <Archive className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{classInfo.archivedMonths.length}</p>
              <p className="text-sm text-muted-foreground">Archived Months</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-accent-foreground">{classInfo.month}</span>
            </div>
            <div>
              <p className="font-medium">Current Month</p>
              <p className="text-sm text-muted-foreground">Active Period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
