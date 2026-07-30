<?php

namespace App\Services;

use App\Models\Media;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\UploadedFile;

class UserProfileService
{
    public function __construct(
        private readonly MediaService $mediaService,
    ) {}

    /**
     * Update a user's extra profile data (bio, website, social links).
     */
    public function updateProfile(User $user, array $data): UserProfile
    {
        /** @var UserProfile $profile */
        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'bio'          => $data['bio'] ?? null,
                'website'      => $data['website'] ?? null,
                'social_links' => $data['social_links'] ?? null,
            ]
        );

        return $profile;
    }

    /**
     * Upload and replace the user's avatar image via the Media pipeline.
     * Returns the Media record.
     */
    public function uploadAvatar(User $user, UploadedFile $file): Media
    {
        $profile = $user->profile()->firstOrCreate(['user_id' => $user->id]);

        return $this->mediaService->replaceForModel(
            $profile,
            Media::COLLECTION_AVATAR,
            $file,
            $user->id,
        );
    }

    /**
     * Upload and replace the user's cover (header) image via the Media pipeline.
     * Returns the Media record.
     */
    public function uploadCover(User $user, UploadedFile $file): Media
    {
        $profile = $user->profile()->firstOrCreate(['user_id' => $user->id]);

        return $this->mediaService->replaceForModel(
            $profile,
            Media::COLLECTION_COVER,
            $file,
            $user->id,
        );
    }

    /**
     * Build the data array for rendering a user's public profile page.
     */
    public function getPublicProfileData(User $profileUser, ?User $currentUser): array
    {
        $profileUser->load('profile');

        $articles = \App\Models\News::where('user_id', $profileUser->id)
            ->published()
            ->latest('published_at')
            ->paginate(10);

        $isFollowing = $currentUser ? $currentUser->isFollowing($profileUser) : false;

        return [
            'profileUser' => [
                'id'              => $profileUser->id,
                'name'            => $profileUser->name,
                'bio'             => $profileUser->profile?->bio,
                'avatar'          => $profileUser->profile?->avatar,
                'cover_image'     => $profileUser->profile?->cover_image,
                'website'         => $profileUser->profile?->website,
                'social_links'    => $profileUser->profile?->social_links ?? [],
                'followers_count' => $profileUser->followers()->count(),
                'following_count' => $profileUser->following()->count(),
                'is_following'    => $isFollowing,
            ],
            'articles' => $articles,
        ];
    }
}
