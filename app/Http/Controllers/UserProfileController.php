<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\User;
use App\Services\UserProfileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function __construct(
        private readonly UserProfileService $profileService,
    ) {}

    /**
     * Show a user's public profile page.
     */
    public function show(Request $request, int $userId)
    {
        $user = User::with(['profile'])->findOrFail($userId);

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

        $this->profileService->updateProfile($user, $request->only([
            'bio', 'website', 'social_links',
        ]));

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
            'avatar' => 'required|image|max:2048',
        ]);

        $this->profileService->uploadAvatar($user, $request->file('avatar'));

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
            'cover_image' => 'required|image|max:4096',
        ]);

        $this->profileService->uploadCover($user, $request->file('cover_image'));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Header profil berhasil diperbarui.']);

        return back();
    }
}
