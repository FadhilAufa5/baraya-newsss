<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('sponsor_name')->nullable();
            $table->text('description')->nullable();
            $table->string('cta_text')->default('Kunjungi');
            $table->string('cta_url');
            $table->enum('type', ['leaderboard', 'in-feed', 'rectangle'])->default('leaderboard');
            $table->enum('position', ['top', 'middle', 'sidebar'])->default('top');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
