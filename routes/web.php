<?php

use App\Http\Controllers\AdController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ShortVideoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SocialActionController;
use App\Http\Controllers\CommentActionController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\GalleryController;
use Illuminate\Support\Facades\Route;

// ── Public routes ─────────────────────────────────────────────────────────────

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('videos', [ShortVideoController::class, 'publicIndex'])->name('videos.index');

// ── Authenticated routes ──────────────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // News — specific paths MUST come before the wildcard {news}
    Route::get('news', [NewsController::class, 'index'])->name('news.index');
    Route::get('news/create', [NewsController::class, 'create'])->name('news.create');
    Route::post('news', [NewsController::class, 'store'])->name('news.store');
    Route::get('news/{news}/edit', [NewsController::class, 'edit'])->name('news.edit');
    Route::put('news/{news}', [NewsController::class, 'update'])->name('news.update');
    Route::delete('news/{news}', [NewsController::class, 'destroy'])->name('news.destroy');
    Route::post('news/{news}/comments', [CommentController::class, 'store'])->name('news.comments.store');

    // Comments
    Route::get('comments', [CommentController::class, 'index'])->name('comments.index');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('comments/bulk-destroy', [CommentController::class, 'bulkDestroy'])->name('comments.bulk-destroy');

    // Short Videos
    Route::get('short-videos', [ShortVideoController::class, 'index'])->name('short-videos.index');
    Route::get('short-videos/create', [ShortVideoController::class, 'create'])->name('short-videos.create');
    Route::post('short-videos', [ShortVideoController::class, 'store'])->name('short-videos.store');
    Route::delete('short-videos/{shortVideo}', [ShortVideoController::class, 'destroy'])->name('short-videos.destroy');
    Route::post('short-videos/{shortVideo}/comments', [CommentController::class, 'storeShortVideo'])->name('short-videos.comments.store');

    // Short Video views
    Route::post('short-videos/{shortVideo}/views', [ShortVideoController::class, 'incrementViews'])->name('short-videos.views');

    // Gallery
    Route::get('gallery', [GalleryController::class, 'index'])->name('gallery.index');

    // iklan Management
    Route::get('iklan', [AdController::class, 'index'])->name('iklan.index');
    Route::get('iklan/create', [AdController::class, 'create'])->name('iklan.create');
    Route::post('iklan', [AdController::class, 'store'])->name('iklan.store');
    Route::get('iklan/{ad}/edit', [AdController::class, 'edit'])->name('iklan.edit');
    Route::put('iklan/{ad}', [AdController::class, 'update'])->name('iklan.update');
    Route::delete('iklan/{ad}', [AdController::class, 'destroy'])->name('iklan.destroy');
    Route::post('iklan/{ad}/toggle', [AdController::class, 'toggle'])->name('iklan.toggle');

    // User Management
    Route::resource('users', UserController::class)->except(['show']);

    // Role Management
    Route::resource('roles', RoleController::class)->except(['show']);

    // Social Action routes (likes, follows, bookmarks)
    Route::post('api/like/{type}/{id}', [SocialActionController::class, 'toggleLike'])->name('social.like');
    Route::post('api/bookmark/{newsId}', [SocialActionController::class, 'toggleBookmark'])->name('social.bookmark');
    Route::post('api/follow/{authorId}', [SocialActionController::class, 'toggleFollow'])->name('social.follow');

    // Comment actions (replies, reporting)
    Route::post('api/comments/{commentId}/reply', [CommentActionController::class, 'reply'])->name('comments.reply');
    Route::post('api/comments/{commentId}/report', [CommentActionController::class, 'report'])->name('comments.report');

    // User profile edits & uploiklan
    Route::patch('settings/profile/extra', [UserProfileController::class, 'update'])->name('profile.extra.update');
    Route::post('settings/profile/avatar', [UserProfileController::class, 'uploadAvatar'])->name('profile.avatar.upload');
    Route::post('settings/profile/cover', [UserProfileController::class, 'uploadCover'])->name('profile.cover.upload');

    // Email
    Route::get('email', [EmailController::class, 'index'])->name('email.index');
    Route::post('email', [EmailController::class, 'store'])->name('email.store');
    Route::post('email/{email}/read', [EmailController::class, 'markRead'])->name('email.read');
    Route::post('email/{email}/star', [EmailController::class, 'toggleStar'])->name('email.star');
    Route::delete('email/{email}', [EmailController::class, 'destroy'])->name('email.destroy');
    Route::delete('email/{id}/force', [EmailController::class, 'forceDelete'])->name('email.force-delete');
    Route::post('email/{id}/restore', [EmailController::class, 'restore'])->name('email.restore');
});

// ── Public news show — MUST be declared AFTER the auth group so that
//    specific paths like news/create are matched first ────────────────────────
Route::get('news/{news}', [NewsController::class, 'show'])->name('news.show');

// User public profile
Route::get('profile/{userId}', [UserProfileController::class, 'show'])->name('profile.show');

// Socialite OAuth routes
Route::get('auth/{provider}/redirect', [OAuthController::class, 'redirect'])->name('oauth.redirect');
Route::get('auth/{provider}/callback', [OAuthController::class, 'callback'])->name('oauth.callback');

require __DIR__ . '/settings.php';
