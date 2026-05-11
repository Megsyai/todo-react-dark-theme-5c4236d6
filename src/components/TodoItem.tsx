import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "framer-motion";

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group",
        todo.completed ? "bg-muted/40 border-transparent" : "bg-card border-border hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="h-5 w-5 rounded-full"
        />
        <div className="flex flex-col">
          <span className={cn(
            "text-sm font-medium transition-all",
            todo.completed && "line-through text-muted-foreground"
          )}>
            {todo.text}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
            <CalendarIcon className="h-3 w-3" />
            {format(todo.createdAt, "PPP", { locale: ar })}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};
