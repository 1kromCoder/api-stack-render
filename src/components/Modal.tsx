import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FC, ReactNode } from "react";
const Modal: FC<{ title?: string; children: ReactNode }> = ({
  children,
  title,
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{children}</DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default Modal;
