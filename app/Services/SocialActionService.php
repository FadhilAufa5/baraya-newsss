<?php

namespace App\Services;

use App\Models\Bookmark;
use App\Models\Comment;
use App\Models\Like;
use App\Models\News;
use App\Models\User;
use App\Notifications\NewFollowerNotification;
use Illuminate\Support\Facades\DB;

class SocialActionService
{
    /**
     * Toggle like for a news article or comment.
     * Returns ['liked' => bool, 'likes_count' => int].
     */
    public function toggleLike(User $user, string $type, int $id): array
    {
        [$likeableType, $likeable] = match ($type) {
            'news'    => [News::class,    News::findOrFail($id)],
            'comment' => [Comment::class, Comment::findOrFail($id)],
            default   => throw new \InvalidArgumentException("Invalid likeable type: {$type}"),
        };

        $liked = DB::transaction(function () use ($user, $likeableType, $likeable, $type) {
            $existing = Like::where([
                'user_id'       => $user->id,
                'likeable_type' => $likeableType,
                'likeable_id'   => $likeable->id,
            ])->first();

            if ($existing) {
                $existing->delete();
                if ($type === 'news') {
                    $likeable->decrement('likes_count');
                }
                return false;
            }

            Like::create([
                'user_id'       => $user->id,
                'likeable_type' => $likeableType,
                'likeable_id'   => $likeable->id,
            ]);
            if ($type === 'news') {
                $likeable->increment('likes_count');
            }
            return true;
        });

        $count = $type === 'news'
            ? $likeable->fresh()->likes_count
            : $likeable->likes()->count();

        return ['liked' => $liked, 'likes_count' => $count];
    }

    /**
     * Toggle bookmark for a news article.
     * Returns ['bookmarked' => bool].
     */
    public function toggleBookmark(User $user, int $newsId): array
    {
        $news = News::findOrFail($newsId);

        $bookmarked = DB::transaction(function () use ($user, $news) {
            $existing = Bookmark::where([
                'user_id' => $user->id,
                'news_id' => $news->id,
            ])->first();

            if ($existing) {
                $existing->delete();
                return false;
            }

            Bookmark::create([
                'user_id' => $user->id,
                'news_id' => $news->id,
            ]);
            return true;
        });

        return ['bookmarked' => $bookmarked];
    }

    /**
     * Toggle follow for an author.
     * Returns ['followed' => bool, 'followers_count' => int].
     *
     * @throws \InvalidArgumentException when a user tries to follow themselves.
     */
    public function toggleFollow(User $user, int $authorId): array
    {
        if ($user->id === $authorId) {
            throw new \InvalidArgumentException('You cannot follow yourself.');
        }

        $author = User::findOrFail($authorId);

        $followed = DB::transaction(function () use ($user, $author) {
            $isFollowing = $user->following()->where('following_id', $author->id)->exists();

            if ($isFollowing) {
                $user->following()->detach($author->id);
                return false;
            }

            $user->following()->attach($author->id);

            try {
                $author->notify(new NewFollowerNotification($user));
            } catch (\Exception $e) {
                // Fail silently — notification is non-critical
            }

            return true;
        });

        return [
            'followed'        => $followed,
            'followers_count' => $author->followers()->count(),
        ];
    }
}
