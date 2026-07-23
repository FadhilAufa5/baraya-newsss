<?php

namespace App\Notifications;

use App\Models\News;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewCommentReplyNotification extends Notification
{
    use Queueable;

    protected User $replier;
    protected Comment $reply;
    protected News $news;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $replier, Comment $reply, News $news)
    {
        $this->replier = $replier;
        $this->reply = $reply;
        $this->news = $news;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'replier_name' => $this->replier->name,
            'replier_id' => $this->replier->id,
            'news_id' => $this->news->id,
            'news_title' => $this->news->title,
            'news_slug' => $this->news->slug,
            'reply_body' => $this->reply->body,
            'message' => "{$this->replier->name} membalas komentar Anda pada artikel \"{$this->news->title}\".",
        ];
    }
}
