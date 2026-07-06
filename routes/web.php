<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ShortVideoController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('videos', [ShortVideoController::class, 'publicIndex'])->name('videos.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // News
    Route::get('news', [NewsController::class, 'index'])->name('news.index');
    Route::get('news/create', [NewsController::class, 'create'])->name('news.create');
    Route::post('news', [NewsController::class, 'store'])->name('news.store');
    Route::get('news/{news}', [NewsController::class, 'show'])->name('news.show');
    Route::post('news/{news}/comments', [CommentController::class, 'store'])->name('news.comments.store');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::get('news/{news}/edit', [NewsController::class, 'edit'])->name('news.edit');
    Route::put('news/{news}', [NewsController::class, 'update'])->name('news.update');
    Route::delete('news/{news}', [NewsController::class, 'destroy'])->name('news.destroy');

    // Comments
    Route::get('comments', [CommentController::class, 'index'])->name('comments.index');
    Route::post('comments/bulk-destroy', [CommentController::class, 'bulkDestroy'])->name('comments.bulk-destroy');

    // Short Videos
    Route::get('short-videos', [ShortVideoController::class, 'index'])->name('short-videos.index');
    Route::get('short-videos/create', [ShortVideoController::class, 'create'])->name('short-videos.create');
    Route::post('short-videos', [ShortVideoController::class, 'store'])->name('short-videos.store');
    Route::delete('short-videos/{shortVideo}', [ShortVideoController::class, 'destroy'])->name('short-videos.destroy');

    // User Management
    Route::resource('users', UserController::class)->except(['show']);

    // Role Management
    Route::resource('roles', RoleController::class)->except(['show']);
});

require __DIR__.'/settings.php';
