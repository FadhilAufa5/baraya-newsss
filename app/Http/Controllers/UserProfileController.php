<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\News;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    /**
     * Show a user's public profile page.
     */
    public function show(Request $request, int $userId)
    {
        $user = User::with(['profile'])->findOrFail($userId);
        
        // Eager load articles published by this user
        $articles = News::where('user_id', $user->id)
            ->published()
            ->latest('published_at')
            ->paginate(10);

        $currentUser = $request->user();
        $isFollowing = $currentUser ? $currentUser->isFollowing($user) : false;

        return Inertia::render('profile/public-profile', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'bio' => $user->profile?->bio,
                'avatar' => $user->profile?->avatar,
                'cover_image' => $user->profile?->cover_image,
                'website' => $user->profile?->website,
                'social_links' => $user->profile?->social_links ?? [],
                'followers_count' => $user->followers()->count(),
                'following_count' => $user->following()->count(),
                'is_following' => $isFollowing,
            ],
            'articles' => $articles,
        ]);
    }

    /**
     * Update extra profile details (bio, website, social links).
     */
    public function update(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        $request->validate([
            'bio' => 'nullable|string|max:1000',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
            'social_links.github' => 'nullable|url|max:255',
            'social_links.twitter' => 'nullable|url|max:255',
            'social_links.facebook' => 'nullable|url|max:255',
        ]);

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'bio' => $request->bio,
                'website' => $request->website,
                'social_links' => $request->social_links,
            ]
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profil berhasil diperbarui.']);

        return back();
    }

    /**
     * Upload profile avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        $request->validate([
            'avatar' => 'required|image|max:2048', // max 2MB
        ]);

        $profile = $user->profile()->firstOrCreate(['user_id' => $user->id]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $profile->update(['avatar' => $path]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto profil berhasil diperbarui.']);

        return back();
    }

    /**
     * Upload profile cover image.
     */
    public function uploadCover(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        $request->validate([
            'cover_image' => 'required|image|max:4096', // max 4MB
        ]);

        $profile = $user->profile()->firstOrCreate(['user_id' => $user->id]);

        if ($request->hasFile('cover_image')) {
            // Delete old cover if exists
            if ($profile->cover_image) {
                Storage::disk('public')->delete($profile->cover_image);
            }

            $path = $request->file('cover_image')->store('covers', 'public');
            $profile->update(['cover_image' => $path]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Header profil berhasil diperbarui.']);

        return back();
    }
}
