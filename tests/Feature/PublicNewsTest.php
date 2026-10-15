<?php

use App\Models\News;
use App\Models\User;

test('guests can visit the public news index page', function () {
    $user = User::factory()->create();
    News::factory()->create([
        'user_id' => $user->id,
        'title' => 'Berita Jawa Barat Hari Ini',
        'slug' => 'berita-jawa-barat-hari-ini',
        'status' => 'published',
        'category' => 'Jawa Barat',
    ]);

    $response = $this->get('/berita');
    $response->assertOk();
});

test('guests can filter public news by category and search', function () {
    $user = User::factory()->create();
    News::factory()->create([
        'user_id' => $user->id,
        'title' => 'Politik Terkini di Gedung Sate',
        'slug' => 'politik-terkini-gedung-sate',
        'status' => 'published',
        'category' => 'Politik',
    ]);

    $response = $this->get('/berita?category=Politik&search=Gedung');
    $response->assertOk();
});

test('guests can access news through /indeks route', function () {
    $response = $this->get('/indeks');
    $response->assertOk();
});
