<?php

namespace App\Http\Controllers;

use App\Services\SocialActionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocialActionController extends Controller
{
    public function __construct(private SocialActionService $service) {}

    /**
     * Toggle like state for articles or comments.
     */
    public function toggleLike(Request $request, string $type, int $id): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (!in_array($type, ['news', 'comment'])) {
            return response()->json(['message' => 'Invalid likeable type.'], 400);
        }

        try {
            $result = $this->service->toggleLike($user, $type, $id);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return response()->json($result);
    }

    /**
     * Toggle bookmark state for articles.
     */
    public function toggleBookmark(Request $request, int $newsId): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json($this->service->toggleBookmark($user, $newsId));
    }

    /**
     * Toggle follow state for authors.
     */
    public function toggleFollow(Request $request, int $authorId): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $result = $this->service->toggleFollow($user, $authorId);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return response()->json($result);
    }
}
