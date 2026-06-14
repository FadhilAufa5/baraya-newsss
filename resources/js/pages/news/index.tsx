import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

export default function NewsIndex({ news }) {
    return (
        <>
            <Head title="News" />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">News</h1>
                <Button asChild>
                    <a href="/news/create">Create</a>
                </Button>
            </div>

            <ul className="mt-6 space-y-4">
                {news.data && news.data.length ? (
                    news.data.map((item) => (
                        <li key={item.id} className="border rounded-md p-4">
                            <h2 className="text-lg font-medium">{item.title}</h2>
                            <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-muted-foreground">No news yet.</li>
                )}
            </ul>
        </>
    )
}

NewsIndex.layout = {
    title: 'News',
}
