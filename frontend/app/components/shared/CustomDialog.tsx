import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { cn } from "@/lib/utils";

interface CustomDialogProps {
    trigger: ReactNode;
    title?: string | ReactNode;
    children: ReactNode;
    contentClassName?: string;
    triggerClassName?: string;
    titleClassName?: string;
    modal?: boolean;
    onPointerDownOutside?: (e: any) => void;
    onInteractOutside?: (e: any) => void;
    hideTitle?: boolean;
}

export default function CustomDialog({
    trigger,
    title,
    children,
    contentClassName,
    triggerClassName,
    titleClassName,
    modal,
    onPointerDownOutside,
    onInteractOutside,
    hideTitle
}: CustomDialogProps) {
    return (
        <Dialog modal={modal}>
            <DialogTrigger asChild className={triggerClassName}>
                {trigger}
            </DialogTrigger>
            <DialogContent 
                onPointerDownOutside={onPointerDownOutside}
                onInteractOutside={onInteractOutside}
                className={cn("bg-zinc-950 text-white border-white/10", contentClassName)}
            >
                {title && (
                    hideTitle ? (
                        <VisuallyHidden.Root>
                            <DialogTitle>{title}</DialogTitle>
                        </VisuallyHidden.Root>
                    ) : (
                        <DialogHeader>
                            <DialogTitle className={titleClassName}>{title}</DialogTitle>
                        </DialogHeader>
                    )
                )}
                {children}
            </DialogContent>
        </Dialog>
    );
}
