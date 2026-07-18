<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\CommentReport;
use App\Models\News;
use App\Models\User;
use App\Notifications\NewCommentReplyNotification;

class CommentService
{
    /**
     * Store a top-level comment on a news article.
     */
    public function postComment(User $user, News $news, string $body): Comment
    {
        /** @var Comment $comment */
        $comment = $news->comments()->create([
            'user_id' => $user->id,
            'body'    => $body,
        ]);

        return $comment;
    }

    /**
     * Post a reply to an existing comment.
     * Notifies the parent comment author if they are not the same person.
     */
    public function postReply(User $user, int $parentCommentId, string $body): Comment
    {
        $parentComment = Comment::with(['user', 'news'])->findOrFail($parentCommentId);

        /** @var Comment $reply */
        $reply = Comment::create([
            'news_id'   => $parentComment->news_id,
            'user_id'   => $user->id,
            'body'      => $body,
            'parent_id' => $parentComment->id,
        ]);

        $reply->load('user');

        // Notify parent comment author if it's a different person
        if ($parentComment->user_id !== $user->id) {
            try {
                $parentComment->user->notify(
                    new NewCommentReplyNotification($user, $reply, $parentComment->news)
                );
            } catch (\Exception $e) {
                // Fail silently — notification is non-critical
            }
        }

        return $reply;
    }

    /**
     * Report a comment for moderation.
     *
     * @throws \RuntimeException when the user has already reported this comment.
     */
    public function reportComment(User $user, int $commentId, string $reason): CommentReport
    {
        $comment = Comment::findOrFail($commentId);

        $exists = CommentReport::where([
            'user_id'    => $user->id,
            'comment_id' => $comment->id,
        ])->exists();

        if ($exists) {
            throw new \RuntimeException('Anda sudah melaporkan komentar ini.');
        }

        return CommentReport::create([
            'user_id'    => $user->id,
            'comment_id' => $comment->id,
            'reason'     => $reason,
            'status'     => 'pending',
        ]);
    }

    /**
     * Delete a single comment (by owner or moderator).
     */
    public function deleteComment(User $user, Comment $comment): void
    {
        $canDelete = $comment->user_id === $user->id || $user->can('delete news');
        abort_unless($canDelete, 403, 'Tidak diizinkan menghapus komentar ini.');

        $comment->delete();
    }

    /**
     * Bulk-delete comments by their IDs.
     */
    public function bulkDeleteComments(array $ids): int
    {
        return Comment::whereIn('id', $ids)->delete();
    }

    /**
     * Get comment statistics for the admin panel.
     */
    public function getStats(): array
    {
        return [
            'total'     => Comment::count(),
            'today'     => Comment::whereDate('created_at', today())->count(),
            'this_week' => Comment::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ])->count(),
        ];
    }
}
