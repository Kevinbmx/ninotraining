import { Tooltip } from "@nextui-org/react";
import { Trash2, Pencil, Eye } from "lucide-react";

interface ActionsProps {
  item: any;
  actions?: {
    view?: (item: any) => void;
    edit?: (item: any) => void;
    delete?: (item: any) => void;
  };
}

export const RenderActions = ({ item, actions }: ActionsProps) => (
  <div className="flex items-center gap-4">
    {actions?.view && (
      <Tooltip content="Ver">
        <button onClick={() => actions.view?.(item)}>
          <Eye size={20} color="#979797" />
        </button>
      </Tooltip>
    )}
    {actions?.edit && (
      <Tooltip content="Editar">
        <button onClick={() => actions.edit?.(item)}>
          <Pencil size={20} color="#979797" />
        </button>
      </Tooltip>
    )}
    {actions?.delete && (
      <Tooltip content="Eliminar">
        <button onClick={() => actions.delete?.(item)}>
          <Trash2 size={20} color="#FF0080" />
        </button>
      </Tooltip>
    )}
  </div>
);
