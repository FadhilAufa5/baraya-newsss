import { Form, Head } from '@inertiajs/react'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

export default function CreateNews() {
    return (
        <>
            <Head title="Create News" />
            <Form action="/news" method="post" className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required placeholder="News title" />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug (optional)</Label>
                            <Input id="slug" name="slug" placeholder="news-title-slug" />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea id="excerpt" name="excerpt" rows={3} placeholder="Short summary" />
                            <InputError message={errors.excerpt} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea id="content" name="content" rows={10} placeholder="Write the article body here..." required />
                            <InputError message={errors.content} />
                        </div>

                        <Button type="submit" className="mt-2 w-full">
                            {processing && <Spinner />} Publish
                        </Button>
                    </div>
                )}
            </Form>
        </>
    )
}

CreateNews.layout = {
    title: 'Create News',
    description: 'Create a new news article',
}
