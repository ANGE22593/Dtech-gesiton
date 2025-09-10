import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DateInput = ({ value, onChange }: DateInputProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date" className="text-lg font-medium">
        Date *
      </Label>
      <Input
        id="date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="transition-smooth focus:shadow-hover"
      />

      {value && (
        <p className="text-gray-600">
          📅 {formatDate(value)}
        </p>
      )}
    </div>
  );
};

export default DateInput;
