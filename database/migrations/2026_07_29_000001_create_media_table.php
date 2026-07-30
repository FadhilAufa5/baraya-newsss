<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            // Collection grouping (news-images, avatars, short-videos, …)
            $table->string('collection', 64);

            // File details
            $table->string('original_name');        // Name uploaded by user
            $table->string('filename');              // Hashed name on disk
            $table->string('disk', 32)->default('public');
            $table->string('path');                  // Relative path on disk
            $table->string('mime_type', 128);
            $table->unsignedBigInteger('size');       // Bytes after processing
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();

            // Processing lifecycle
            $table->string('status', 20)->default('pending'); // pending → processing → ready | failed

            // Polymorphic owner (News, ShortVideo, UserProfile, …)
            $table->nullableMorphs('mediable');

            $table->unsignedBigInteger('uploaded_by')->nullable();

            // Conversion outputs — {"webp": "path/to.webp", "thumbnail": "path/to.jpg"}
            $table->json('conversions')->nullable();

            // Arbitrary extra data — duration, codec, original_size, etc.
            $table->json('metadata')->nullable();

            $table->timestamps();

            // Composite indexes for common queries
            $table->index(['collection', 'status']);
            $table->foreign('uploaded_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
