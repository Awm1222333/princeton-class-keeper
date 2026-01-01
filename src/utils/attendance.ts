import { Student, ClassInfo, AttendanceStats, ArchivedMonth } from '@/types/attendance';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateStudentStats = (student: Student) => {
  let present = 0;
  let absent = 0;
  let leave = 0;

  for (let day = 1; day <= 30; day++) {
    const status = student.attendance[day];
    if (status === 'P') present++;
    else if (status === 'A') absent++;
    else if (status === 'L') leave++;
  }

  return { present, absent, leave };
};

export const calculateClassStats = (students: Student[]): AttendanceStats => {
  const activeStudents = students.filter(s => !s.isPermanentAbsent);
  
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLeave = 0;
  let feesPaidCount = 0;
  let feesUnpaidCount = 0;

  activeStudents.forEach(student => {
    const stats = calculateStudentStats(student);
    totalPresent += stats.present;
    totalAbsent += stats.absent;
    totalLeave += stats.leave;
    if (student.feesPaid) feesPaidCount++;
    else feesUnpaidCount++;
  });

  const totalDays = totalPresent + totalAbsent + totalLeave;
  const averageAttendance = totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;

  return {
    totalStudents: activeStudents.length,
    totalPresent,
    totalAbsent,
    totalLeave,
    averageAttendance,
    feesPaidCount,
    feesUnpaidCount,
  };
};

export const checkPermanentAbsent = (student: Student): boolean => {
  const stats = calculateStudentStats(student);
  return stats.absent >= 5;
};

export const sortStudentsAlphabetically = (students: Student[]): Student[] => {
  return [...students].sort((a, b) => 
    a.firstName.localeCompare(b.firstName, 'en', { sensitivity: 'base' })
  );
};

export const getAbsentStudentsForDay = (students: Student[], day: number): Student[] => {
  return students.filter(s => !s.isPermanentAbsent && s.attendance[day] === 'A');
};

export const getPermanentAbsentStudents = (students: Student[]): Student[] => {
  return students.filter(s => s.isPermanentAbsent);
};

export const createArchivedMonth = (classInfo: ClassInfo): ArchivedMonth => {
  return {
    id: generateId(),
    month: classInfo.month,
    startDateAfghan: classInfo.startDateAfghan,
    startDateGregorian: classInfo.startDateGregorian,
    endDateAfghan: classInfo.endDateAfghan,
    endDateGregorian: classInfo.endDateGregorian,
    startTime: classInfo.startTime,
    endTime: classInfo.endTime,
    speakingTeacher: classInfo.speakingTeacher,
    grammarTeacher: classInfo.grammarTeacher,
    students: JSON.parse(JSON.stringify(classInfo.students)),
    archivedAt: new Date().toISOString(),
    totalStudents: classInfo.students.filter(s => !s.isPermanentAbsent).length,
    permanentAbsentList: classInfo.students.filter(s => s.isPermanentAbsent),
  };
};

export const resetForNewMonth = (students: Student[]): Student[] => {
  return students.map(student => ({
    ...student,
    attendance: {},
    feesPaid: false,
    isPermanentAbsent: false,
  }));
};

export const isValidMobileNumber = (mobile: string): boolean => {
  const digitsOnly = mobile.replace(/\D/g, '');
  return digitsOnly.length >= 10;
};

export const formatDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generatePDFContent = (classInfo: ClassInfo, type: 'daily' | 'monthly' | 'absent' | 'permanent'): string => {
  // This would generate HTML content for PDF
  // In a real implementation, you'd use a library like jsPDF or html2pdf
  return '';
};
