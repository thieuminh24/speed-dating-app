import { FaCircleCheck } from "react-icons/fa6";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectCardProps {
  title: string;
  content: string;
  selected?: boolean;
}

export function SelectCard({
  title,
  content,
  selected = false,
}: SelectCardProps) {
  return (
    <Card
      className={`flex flex-row items-center gap-3 p-5 rounded-xl cursor-pointer transition hover:shadow-md ${
        selected ? "border border-grey-700 " : "border border-gray-200"
      }`}
    >
      {selected && (
        <FaCircleCheck className="text-rose-500 shrink-0" size={20} />
      )}
      <CardContent className="p-0">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-500">{content}</div>
      </CardContent>
      <CardAction className="ml-auto">
        <Button variant="link" className="group cursor-pointer p-0">
          <Pencil className="text-gray-300 transition group-hover:text-gray-500 size-5" />
        </Button>
      </CardAction>
    </Card>
  );
}
