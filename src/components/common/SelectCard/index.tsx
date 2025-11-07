import { FaCircleCheck } from "react-icons/fa6";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectCardProps {
  title: string;
  content?: string; // ← Cho phép undefined
  selected?: boolean;
  onRemove?: () => void; // ← Thêm nút xóa
}

export function SelectCard({
  title,
  content,
  selected = false,
  onRemove,
}: SelectCardProps) {
  return (
    <Card
      className={`flex flex-row items-center gap-3 p-5 rounded-xl cursor-pointer transition hover:shadow-md ${
        selected ? "border border-gray-700" : "border border-gray-200"
      }`}
    >
      {/* Check icon khi selected */}
      {selected && (
        <FaCircleCheck className="text-rose-500 shrink-0" size={20} />
      )}

      {/* Nội dung */}
      <CardContent className="p-0 flex-1">
        <div className="font-medium text-gray-900">{title}</div>
        {content && <div className="text-sm text-gray-500">{content}</div>}
      </CardContent>

      {/* Hành động: Edit + Remove */}
      <CardAction className="ml-auto flex gap-2 items-center">
        {/* Nút Edit (giữ nguyên) */}
        <Button variant="link" className="group cursor-pointer p-0">
          <Pencil className="text-gray-300 transition group-hover:text-gray-500 size-5" />
        </Button>

        {/* Nút Remove (mới) */}
        {onRemove && (
          <Button
            variant="link"
            className="group cursor-pointer p-0"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn click card
              onRemove();
            }}
          >
            <span className="text-rose-500 text-sm font-medium transition group-hover:text-rose-600">
              Remove
            </span>
          </Button>
        )}
      </CardAction>
    </Card>
  );
}
