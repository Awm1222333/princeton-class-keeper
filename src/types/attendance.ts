export interface Student {
  id: string;
  serialNumber: number;
  firstName: string;
  fatherName: string;
  mobileNumber: string;
  registrationNumber: string;
  feesPaid: boolean;
  notes: string;
  attendance: Record<number, 'P' | 'A' | 'L' | ''>;
  isPermanentAbsent: boolean;
}

export interface ClassInfo {
  id: string;
  name: string;
  month: string;
  startDateAfghan: string;
  startDateGregorian: string;
  endDateAfghan: string;
  endDateGregorian: string;
  startTime: string;
  endTime: string;
  speakingTeacher: string;
  grammarTeacher: string;
  students: Student[];
  archivedMonths: ArchivedMonth[];
  createdAt: string;
}

export interface ArchivedMonth {
  id: string;
  month: string;
  startDateAfghan: string;
  startDateGregorian: string;
  endDateAfghan: string;
  endDateGregorian: string;
  startTime: string;
  endTime: string;
  speakingTeacher: string;
  grammarTeacher: string;
  students: Student[];
  archivedAt: string;
  totalStudents: number;
  permanentAbsentList: Student[];
}

export interface AttendanceStats {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  averageAttendance: number;
  feesPaidCount: number;
  feesUnpaidCount: number;
}

export const AFGHAN_MONTHS = [
  'Hamal',
  'Sawr',
  'Jawza',
  'Saratan',
  'Asad',
  'Sonbola',
  'Mizan',
  'Aqrab',
  'Qaws',
  'Jadi',
  'Dalwa',
  'Hoot',
] as const;

export type AfghanMonth = typeof AFGHAN_MONTHS[number];
