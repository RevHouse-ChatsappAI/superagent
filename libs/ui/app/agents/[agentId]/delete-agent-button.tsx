import React from "react"
import { TbTrashX } from "react-icons/tb"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"

interface DeleteAgentButtonProps {
  handleDelete: () => void
}

const DeleteAgentButton: React.FC<DeleteAgentButtonProps> = ({
  handleDelete,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
      >
        <TbTrashX size="18px" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al
            agente. y eliminar sus datos de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAgentButton
