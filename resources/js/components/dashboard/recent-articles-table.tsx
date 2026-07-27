import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight } from 'lucide-react';

export interface Article {
    id: number;
    title: string;
    category: string;
    views: number;
    status: 'published' | 'draft' | 'archived';
    date: string;
}

interface RecentArticlesTableProps {
    recentArticles: Article[];
}

function formatNumber(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
}

function statusVariant(s: Article['status']): 'success' | 'warning' | 'outline' {
    if (s === 'published') return 'success';
    if (s === 'draft') return 'warning';
    return 'outline';
}

export function RecentArticlesTable({ recentArticles }: RecentArticlesTableProps) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Artikel Terbaru</CardTitle>
                        <CardDescription className="text-xs">Daftar artikel yang baru dipublikasikan</CardDescription>
                    </div>
                    <a
                        href="/news"
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                        Lihat semua <ArrowUpRight className="size-3" />
                    </a>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6">Judul</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentArticles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell className="pl-6">
                                    <div>
                                        <p className="max-w-[260px] truncate text-sm font-medium">{article.title}</p>
                                        <p className="text-xs text-muted-foreground">{article.date}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-xs">
                                        {article.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-sm font-semibold">
                                    {formatNumber(article.views)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={statusVariant(article.status)} className="capitalize">
                                        {article.status === 'published' ? 'Tayang' : article.status === 'draft' ? 'Draft' : 'Arsip'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
