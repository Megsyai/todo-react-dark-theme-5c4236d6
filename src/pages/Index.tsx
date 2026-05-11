import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoItem } from "@/components/TodoItem";
import { Plus, Moon, Sun, ListTodo, CheckCircle2, Circle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const Index = () => {
  const [todos, setTodos] = useStore<Todo[]>("todos-app", []);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
    toast.success("تمت إضافة المهمة بنجاح");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
    toast.error("تم حذف المهمة");
  };

  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter(t => !t.completed);
    if (filter === "completed") return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-background text-foreground font-sans pt-12 pb-20 px-4 dir-rtl`} dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <ListTodo className="text-primary-foreground h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">مهامي اليومية</h1>
              <p className="text-sm text-muted-foreground font-medium">نظم وقتك، أنجز أكثر</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full h-11 w-11">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-700 delay-100">
          <Card className="bg-muted/30 border-none shadow-none text-center p-4">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">الكل</p>
          </Card>
          <Card className="bg-muted/30 border-none shadow-none text-center p-4">
            <p className="text-2xl font-bold text-primary">{stats.active}</p>
            <p className="text-xs text-muted-foreground">قيد التنفيذ</p>
          </Card>
          <Card className="bg-muted/30 border-none shadow-none text-center p-4">
            <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">مكتملة</p>
          </Card>
        </div>

        {/* Input Section */}
        <form onSubmit={addTodo} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ما الذي تنوي فعله اليوم؟"
            className="h-14 pr-12 text-lg rounded-2xl border-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-card"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute left-2 top-2 h-10 w-10 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <div className="absolute right-4 top-4 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Circle className="h-6 w-6" />
          </div>
        </form>

        {/* List Section */}
        <div className="space-y-6 animate-in fade-in duration-700 delay-300">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl bg-muted/50 p-1">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">الكل</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">النشطة</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">المكتملة</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
                  <div className="bg-muted rounded-full p-6">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-medium">لا توجد مهام هنا</p>
                    <p className="text-sm">ابدأ بإضافة مهامك لليوم</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
