import { ClassInfo, AFGHAN_MONTHS } from '@/types/attendance';
import { Calendar, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClassInfoFormProps {
  classInfo: ClassInfo;
  onUpdate: (updates: Partial<ClassInfo>) => void;
}

export const ClassInfoForm = ({ classInfo, onUpdate }: ClassInfoFormProps) => {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Class Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Month Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">Month</Label>
          <Select
            value={classInfo.month}
            onValueChange={(value) => onUpdate({ month: value })}
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select month" />
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

        {/* Start Date Afghan */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">Start Date (Afghan)</Label>
          <Input
            type="text"
            placeholder="e.g., 1 Hamal 1403"
            value={classInfo.startDateAfghan}
            onChange={(e) => onUpdate({ startDateAfghan: e.target.value })}
            className="input-field"
          />
        </div>

        {/* Start Date Gregorian */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">Start Date (Gregorian)</Label>
          <Input
            type="date"
            value={classInfo.startDateGregorian}
            onChange={(e) => onUpdate({ startDateGregorian: e.target.value })}
            className="input-field"
          />
        </div>

        {/* End Date Afghan */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">End Date (Afghan)</Label>
          <Input
            type="text"
            placeholder="e.g., 30 Hamal 1403"
            value={classInfo.endDateAfghan}
            onChange={(e) => onUpdate({ endDateAfghan: e.target.value })}
            className="input-field"
          />
        </div>

        {/* End Date Gregorian */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">End Date (Gregorian)</Label>
          <Input
            type="date"
            value={classInfo.endDateGregorian}
            onChange={(e) => onUpdate({ endDateGregorian: e.target.value })}
            className="input-field"
          />
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Start Time
          </Label>
          <Input
            type="time"
            value={classInfo.startTime}
            onChange={(e) => onUpdate({ startTime: e.target.value })}
            className="input-field"
          />
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            End Time
          </Label>
          <Input
            type="time"
            value={classInfo.endTime}
            onChange={(e) => onUpdate({ endTime: e.target.value })}
            className="input-field"
          />
        </div>

        {/* Speaking Teacher */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Speaking Teacher
          </Label>
          <Input
            type="text"
            placeholder="Teacher name"
            value={classInfo.speakingTeacher}
            onChange={(e) => onUpdate({ speakingTeacher: e.target.value })}
            className="input-field"
          />
        </div>

        {/* Grammar Teacher */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Grammar Teacher
          </Label>
          <Input
            type="text"
            placeholder="Teacher name"
            value={classInfo.grammarTeacher}
            onChange={(e) => onUpdate({ grammarTeacher: e.target.value })}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
};
