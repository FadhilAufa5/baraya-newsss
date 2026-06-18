<?php

use App\Models\Comment;
use App\Models\News;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests are redirected to the login page from news index', function () {
    $response = $this->get(route('news.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the news index', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('news.index'));
    $response->assertOk();
});

test('authenticated users can create a news article', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $image = UploadedFile::fake()->image('news-cover.jpg');

    $response = $this->post(route('news.store'), [
        'title' => 'Judul Artikel Baru',
        'category' => 'Nasional',
        'content' => '<p>Konten artikel berita yang sangat detail dan mendalam.</p>',
        'author' => 'Ahmad Penulis',
        'excerpt' => 'Ringkasan artikel.',
        'image' => $image,
        'image_caption' => 'Keterangan Gambar Utama',
        'meta_description' => 'Meta deskripsi artikel.',
        'tags' => ['politik', 'nasional'],
        'status' => 'published',
        'is_featured' => true,
    ]);

    $response->assertRedirect(route('news.index'));

    $news = News::first();
    expect($news)->not->toBeNull();
    expect($news->title)->toBe('Judul Artikel Baru');
    expect($news->slug)->toBe('judul-artikel-baru');
    expect($news->category)->toBe('Nasional');
    expect($news->user_id)->toBe($user->id);
    expect($news->image)->not->toBeNull();

    Storage::disk('public')->assertExists($news->image);
});

test('authenticated users can create a news article with short video', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $video = UploadedFile::fake()->create('news-short.mp4', 1024, 'video/mp4');

    $response = $this->post(route('news.store'), [
        'title' => 'Artikel Dengan Short Video',
        'category' => 'Teknologi',
        'content' => '<p>Konten artikel dengan short video.</p>',
        'short_video' => $video,
        'short_video_caption' => 'Cuplikan singkat',
        'status' => 'draft',
        'is_featured' => false,
    ]);

    $response->assertRedirect(route('news.index'));

    $news = News::where('title', 'Artikel Dengan Short Video')->first();
    expect($news)->not->toBeNull();
    expect($news->short_video)->not->toBeNull();
    expect($news->short_video_caption)->toBe('Cuplikan singkat');

    Storage::disk('public')->assertExists($news->short_video);
});

test('authenticated users can add and delete their own news comments', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $news = News::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->post(route('news.comments.store', $news), [
        'body' => 'Komentar pembaca untuk artikel ini.',
    ]);

    $response->assertRedirect();

    $comment = Comment::first();
    expect($comment)->not->toBeNull();
    expect($comment->news_id)->toBe($news->id);
    expect($comment->user_id)->toBe($user->id);

    $deleteResponse = $this->delete(route('comments.destroy', $comment));
    $deleteResponse->assertRedirect();

    expect(Comment::find($comment->id))->toBeNull();
});

test('authenticated users can view a news article and increment views', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $news = News::factory()->create([
        'title' => 'Detail Berita Hangat',
        'slug' => 'detail-berita-hangat',
        'user_id' => $user->id,
        'views' => 10,
    ]);

    $response = $this->get(route('news.show', $news));
    $response->assertOk();

    $news->refresh();
    expect($news->views)->toBe(11);
});

test('authenticated users can update a news article', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $news = News::factory()->create([
        'title' => 'Judul Lama',
        'slug' => 'judul-lama',
        'category' => 'Politik',
        'content' => 'Konten lama',
        'status' => 'draft',
        'user_id' => $user->id,
    ]);

    $response = $this->put(route('news.update', $news), [
        'title' => 'Judul Diperbarui',
        'category' => 'Ekonomi',
        'content' => 'Konten diperbarui',
        'status' => 'published',
    ]);

    $response->assertRedirect(route('news.index'));

    $news->refresh();
    expect($news->title)->toBe('Judul Diperbarui');
    expect($news->category)->toBe('Ekonomi');
    expect($news->content)->toBe('Konten diperbarui');
    expect($news->status)->toBe('published');
});

test('authenticated users can delete a news article and its image', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $imagePath = Storage::disk('public')->put('news', UploadedFile::fake()->image('old-cover.jpg'));

    $news = News::factory()->create([
        'user_id' => $user->id,
        'image' => $imagePath,
    ]);

    Storage::disk('public')->assertExists($imagePath);

    $response = $this->delete(route('news.destroy', $news));
    $response->assertRedirect(route('news.index'));

    expect(News::find($news->id))->toBeNull();
    Storage::disk('public')->assertMissing($imagePath);
});
