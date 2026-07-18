<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentReport;
use App\Notifications\NewCommentReplyNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentActionController extends Controller
{
    /**
     * Post a reply to an existing comment.
     */
    public function reply(Request $request, int $commentId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $parentComment = Comment::findOrFail($commentId);

        $reply = Comment::create([
            'news_id' => $parentComment->news_id,
            'user_id' => $user->id,
            'body' => $request->body,
            'parent_id' => $parentComment->id,
        ]);

        // Eager load relationships for front-end rendering
        $reply->load('user');

        // Notify parent comment author if it's not the same person
        if ($parentComment->user_id !== $user->id) {
            try {
                $parentComment->user->notify(new NewCommentReplyNotification($user, $reply, $parentComment->news));
            } catch (\Exception $e) {
                // Fail silently or log
            }
        }

        return response()->json([
            'message' => 'Reply posted successfully.',
            'reply' => [
                'id' => $reply->id,
                'news_id' => $reply->news_id,
                'user_id' => $reply->user_id,
                'body' => $reply->body,
                'parent_id' => $reply->parent_id,
                'created_at' => $reply->created_at->toISOString(),
                'user' => [
                    'id' => $reply->user->id,
                    'name' => $reply->user->name,
                ],
                'replies' => [],
                'likes' => [],
                'likes_count' => 0,
                'is_liked' => false,
            ]
        ]);
    }

    /**
     * Report a comment for spam or moderation.
     */
    public function report(Request $request, int $commentId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $comment = Comment::findOrFail($commentId);

        // Check if already reported by this user
        $exists = CommentReport::where([
            'user_id' => $user->id,
            'comment_id' => $comment->id,
        ])->exists();

        if ($exists) {
            return response()->json(['message' => 'Anda sudah melaporkan komentar ini.'], 422);
        }

        CommentReport::create([
            'user_id' => $user->id,
            'comment_id' => $comment->id,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim dan akan segera ditinjau oleh moderator.',
        ]);
    }
}
