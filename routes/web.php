<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('news', [\App\Http\Controllers\NewsController::class, 'index'])->name('news.index');
    Route::get('news/create', [\App\Http\Controllers\NewsController::class, 'create'])->name('news.create');
    Route::post('news', [\App\Http\Controllers\NewsController::class, 'store'])->name('news.store');

    // Berita Acara
    Route::get('berita-acara', [\App\Http\Controllers\BeritaAcaraController::class, 'index'])->name('berita-acara.index');
    Route::post('berita-acara', [\App\Http\Controllers\BeritaAcaraController::class, 'store'])->name('berita-acara.store');
    Route::put('berita-acara/{beritaAcara}', [\App\Http\Controllers\BeritaAcaraController::class, 'update'])->name('berita-acara.update');
    Route::delete('berita-acara/{beritaAcara}', [\App\Http\Controllers\BeritaAcaraController::class, 'destroy'])->name('berita-acara.destroy');
    Route::patch('berita-acara/{beritaAcara}/status', [\App\Http\Controllers\BeritaAcaraController::class, 'updateStatus'])->name('berita-acara.update-status');
});

require __DIR__.'/settings.php';
