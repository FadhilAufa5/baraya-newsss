<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // News
    Route::get('news', [\App\Http\Controllers\NewsController::class, 'index'])->name('news.index');
    Route::get('news/create', [\App\Http\Controllers\NewsController::class, 'create'])->name('news.create');
    Route::post('news', [\App\Http\Controllers\NewsController::class, 'store'])->name('news.store');
    Route::get('news/{news}', [\App\Http\Controllers\NewsController::class, 'show'])->name('news.show');
    Route::get('news/{news}/edit', [\App\Http\Controllers\NewsController::class, 'edit'])->name('news.edit');
    Route::put('news/{news}', [\App\Http\Controllers\NewsController::class, 'update'])->name('news.update');
    Route::delete('news/{news}', [\App\Http\Controllers\NewsController::class, 'destroy'])->name('news.destroy');

    // User Management
    Route::resource('users', \App\Http\Controllers\UserController::class)->except(['show']);

    // Role Management
    Route::resource('roles', \App\Http\Controllers\RoleController::class)->except(['show']);
});

require __DIR__.'/settings.php';

