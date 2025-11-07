import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogForm({
  dialogTrigger,
  dialogTitle,
  dialogDescription,
  dialogBody,
  btnLetf,
  btnRight,
}: {
  dialogTrigger?: React.ReactNode;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogBody?: React.ReactNode;
  btnLetf?: React.ReactNode;
  btnRight?: React.ReactNode;
}) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {dialogBody}
          <DialogFooter>
            <DialogClose asChild>{btnLetf}</DialogClose> {btnRight}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
