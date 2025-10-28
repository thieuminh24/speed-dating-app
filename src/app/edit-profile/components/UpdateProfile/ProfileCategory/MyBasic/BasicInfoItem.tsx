// components/profile-basic-item.tsx
import { Plus } from "lucide-react";

interface BasicInfoItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  // onClick: () => void;
}

export function BasicInfoItem({
  icon: Icon,
  label,
  value,
  // onClick,
}: BasicInfoItemProps) {
  return (
    <div
      // onClick={onClick}
      className="flex items-center justify-between border rounded-full px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-500 cursor-pointer transition"
    >
      <div className="flex items-center gap-2">
        <Icon />
        <span>{label}</span>
      </div>
      <div className="text-gray-500">
        {value ? value : <Plus className="w-4 h-4" />}
      </div>
    </div>
  );
}
