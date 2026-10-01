"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowUpRight,
  Check,
  Flame,
  GripVertical,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type { AdminOverrides, RealEstateObject } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

type Props = {
  objects: RealEstateObject[];
  initialOverrides: AdminOverrides;
};

export function AdminDashboard({ objects, initialOverrides }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [overrides, setOverrides] = React.useState<AdminOverrides>(initialOverrides);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editShort, setEditShort] = React.useState("");

  const objectMap = React.useMemo(
    () => new Map(objects.map((o) => [o.id, o])),
    [objects],
  );

  // Initial hot list: explicit ids, fallback to original `hot` flag.
  React.useEffect(() => {
    if (overrides.hotIds.length === 0 && initialOverrides.hotIds.length === 0) {
      const fallback = objects.filter((o) => o.hot).map((o) => o.id);
      if (fallback.length > 0) {
        setOverrides((cur) => ({
          ...cur,
          hotIds: fallback,
          hotOrder: fallback,
        }));
      }
    }
  }, [objects, initialOverrides, overrides.hotIds.length]);

  const orderedHot = React.useMemo(() => {
    const orderMap = new Map(overrides.hotOrder.map((id, i) => [id, i]));
    return [...overrides.hotIds].sort((a, b) => {
      const ai = orderMap.has(a) ? (orderMap.get(a) as number) : 1e9;
      const bi = orderMap.has(b) ? (orderMap.get(b) as number) : 1e9;
      return ai - bi;
    });
  }, [overrides.hotIds, overrides.hotOrder]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return objects
      .filter((o) => !overrides.hotIds.includes(o.id))
      .filter((o) =>
        q ? o.title.toLowerCase().includes(q) || String(o.id) === q : true,
      )
      .sort((a, b) => a.title.localeCompare(b.title, "ru"));
  }, [objects, overrides.hotIds, search]);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedHot.indexOf(Number(active.id));
    const newIndex = orderedHot.indexOf(Number(over.id));
    const next = arrayMove(orderedHot, oldIndex, newIndex);
    setOverrides((cur) => ({ ...cur, hotOrder: next }));
  };

  const addHot = (id: number) => {
    setOverrides((cur) => ({
      ...cur,
      hotIds: [...cur.hotIds, id],
      hotOrder: [...cur.hotOrder.filter((x) => x !== id), id],
    }));
  };

  const removeHot = (id: number) => {
    setOverrides((cur) => ({
      ...cur,
      hotIds: cur.hotIds.filter((x) => x !== id),
      hotOrder: cur.hotOrder.filter((x) => x !== id),
    }));
  };

  const startEdit = (obj: RealEstateObject) => {
    const custom = overrides.customTexts[String(obj.id)];
    setEditingId(obj.id);
    setEditTitle(custom?.title ?? obj.title);
    setEditShort(custom?.shortDescription ?? obj.shortDescription);
  };

  const saveEdit = () => {
    if (editingId == null) return;
    const obj = objectMap.get(editingId);
    if (!obj) return;
    setOverrides((cur) => {
      const nextCustom = { ...cur.customTexts };
      const stripped: { title?: string; shortDescription?: string } = {};
      if (editTitle.trim() && editTitle !== obj.title) stripped.title = editTitle.trim();
      if (
        editShort.trim() !== obj.shortDescription &&
        editShort.trim() !== ""
      )
        stripped.shortDescription = editShort.trim();
      if (Object.keys(stripped).length === 0) {
        delete nextCustom[String(editingId)];
      } else {
        nextCustom[String(editingId)] = stripped;
      }
      return { ...cur, customTexts: nextCustom };
    });
    setEditingId(null);
  };

  const persist = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/overrides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overrides),
      });
      if (!res.ok) throw new Error();
      await fetch("/api/admin/invalidate", { method: "POST" });
      toast({
        variant: "success",
        title: "Изменения сохранены",
        description: "Главная страница обновится в течение минуты.",
      });
      router.refresh();
    } catch {
      toast({
        variant: "error",
        title: "Не удалось сохранить",
        description: "Проверьте соединение и попробуйте снова.",
      });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-midnight-950/85 backdrop-blur-xl">
        <div className="container-x flex h-[78px] items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <div className="leading-tight">
              <div className="font-display text-xl text-white">
                Lam <span className="gold-text">Admin</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-white/45">
                Управление контентом
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                Открыть сайт <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button onClick={persist} disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Сохраняем
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Сохранить
                </>
              )}
            </Button>
            <Button onClick={logout} variant="ghost" size="icon" aria-label="Выйти">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container-x py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <span className="label-eyebrow inline-flex items-center gap-2">
                  <Flame className="h-3.5 w-3.5" /> Горячие предложения
                </span>
                <h2 className="mt-3 font-display text-3xl text-white">
                  Лоты на главной странице
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  Перетаскивайте карточки, чтобы поменять порядок отображения.
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPickerOpen((v) => !v)}
              >
                <Plus className="h-4 w-4" /> Добавить
              </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={orderedHot} strategy={verticalListSortingStrategy}>
                <ul className="mt-6 space-y-3">
                  {orderedHot.length === 0 && (
                    <li className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-8 text-center text-sm text-white/55">
                      Пока пусто — добавьте первый объект справа.
                    </li>
                  )}
                  {orderedHot.map((id) => {
                    const obj = objectMap.get(id);
                    if (!obj) return null;
                    const isEditing = editingId === id;
                    const custom = overrides.customTexts[String(id)];
                    return (
                      <SortableRow key={id} id={id}>
                        <div className="flex w-full items-start gap-4">
                          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-midnight-900">
                            <Image
                              src={obj.image}
                              alt={obj.title}
                              fill
                              sizes="120px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <div className="space-y-2">
                                <Input
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="h-10"
                                />
                                <Textarea
                                  value={editShort}
                                  onChange={(e) => setEditShort(e.target.value)}
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveEdit}>
                                    <Check className="h-4 w-4" /> Применить
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingId(null)}
                                  >
                                    Отмена
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-display text-lg text-white">
                                    {custom?.title ?? obj.title}
                                  </span>
                                  {custom && (
                                    <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-gold">
                                      редактировано
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-sm text-white/55">
                                  {(custom?.shortDescription ?? obj.shortDescription) || "Без описания"}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            {!isEditing && (
                              <button
                                aria-label="Редактировать"
                                onClick={() => startEdit(obj)}
                                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-gold/40 hover:text-gold"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              aria-label="Убрать"
                              onClick={() => removeHot(id)}
                              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-destructive/50 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </SortableRow>
                    );
                  })}
                </ul>
              </SortableContext>
            </DndContext>
          </section>

          <aside className={cn("lg:col-span-5", !pickerOpen && "lg:block hidden")}>
            <div className="glass-panel sticky top-[100px] p-6">
              <div className="flex items-center justify-between">
                <span className="label-eyebrow">Каталог</span>
                <button
                  onClick={() => setPickerOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-white/55 hover:text-white lg:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-2 font-display text-2xl text-white">Добавить в подборку</h3>
              <p className="mt-1 text-sm text-white/55">
                Выберите объект из общего каталога — он добавится в конец списка.
              </p>
              <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по названию"
                  className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </label>
              <ul className="mt-4 max-h-[440px] space-y-2 overflow-y-auto pr-1">
                {filtered.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20"
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-midnight-900">
                      <Image
                        src={o.image}
                        alt={o.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-white">{o.title}</div>
                      <div className="truncate text-[12px] text-white/45">{o.price}</div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => addHot(o.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center text-sm text-white/45">
                    Ничего не найдено
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SortableRow({ id, children }: { id: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 rounded-2xl border border-white/10 bg-midnight-900/60 p-4 transition",
        isDragging && "border-gold/40 shadow-glow",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Перетащить"
        className="grid h-9 w-9 shrink-0 cursor-grab place-items-center rounded-full text-white/35 hover:text-gold active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </li>
  );
}
