import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Trash2, MessageSquare, Newspaper, Info, Clock } from 'lucide-react';

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'comment' | 'article' | 'system';
    read: boolean;
}

interface NotificationsPopoverProps {
    initialNotifications: NotificationItem[];
}

export function NotificationsPopover({ initialNotifications }: NotificationsPopoverProps) {
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const toggleRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative h-10 w-10 rounded-full border-border/80 hover:bg-accent transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm group"
                >
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors group-hover:animate-wiggle" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 sm:w-96 p-0 border border-border/80 shadow-xl rounded-xl" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3 border-border/65 bg-muted/20">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">Notifikasi</span>
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="px-1.5 py-0.5 text-[10px] font-bold">
                                {unreadCount} baru
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={markAllAsRead}
                        >
                            <Check className="h-3 w-3" />
                            Tandai dibaca
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[320px]">
                    {notifications.length > 0 ? (
                        <div className="flex flex-col">
                            {notifications.map((n) => {
                                const isComment = n.type === 'comment';
                                const isArticle = n.type === 'article';

                                return (
                                    <div
                                        key={n.id}
                                        className={`group relative flex items-start gap-3 border-b border-border/40 p-4 transition-colors hover:bg-muted/50 ${
                                            !n.read ? 'bg-primary/5 dark:bg-primary/5' : ''
                                        }`}
                                    >
                                        <div
                                            className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                                isComment
                                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                                                    : isArticle
                                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                                                    : 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400'
                                            }`}
                                        >
                                            {isComment ? (
                                                <MessageSquare className="size-4" />
                                            ) : isArticle ? (
                                                <Newspaper className="size-4" />
                                            ) : (
                                                <Info className="size-4" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1 pr-6">
                                            <div className="flex items-center justify-between">
                                                <p className={`text-xs font-semibold ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {n.title}
                                                </p>
                                                {!n.read && (
                                                    <span className="absolute right-4 top-5 size-2 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {n.description}
                                            </p>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <Clock className="size-3" />
                                                <span>{n.time}</span>
                                            </div>
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute right-2 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/95 dark:bg-muted/95 rounded-md border p-0.5 shadow-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-6 cursor-pointer text-muted-foreground hover:text-foreground"
                                                title={n.read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                                                onClick={() => toggleRead(n.id)}
                                            >
                                                <Check className={`size-3.5 ${n.read ? 'opacity-40' : 'text-blue-500 font-bold'}`} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-6 cursor-pointer text-muted-foreground hover:text-red-500"
                                                title="Hapus"
                                                onClick={() => deleteNotification(n.id)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex h-[320px] flex-col items-center justify-center gap-2 p-6 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Bell className="size-6 text-muted-foreground opacity-60" />
                            </div>
                            <p className="text-sm font-medium">Tidak ada notifikasi</p>
                            <p className="text-xs text-muted-foreground">
                                Semua pemberitahuan baru akan ditampilkan di sini.
                            </p>
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="flex items-center justify-center border-t px-4 py-2 bg-muted/10 border-border/65">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-full gap-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/5 cursor-pointer font-medium"
                            onClick={clearAll}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus Semua
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
