<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->foreignId('short_video_id')->nullable()->constrained('short_videos')->cascadeOnDelete()->after('news_id');
            $table->foreignId('news_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['short_video_id']);
            $table->dropColumn('short_video_id');
            $table->foreignId('news_id')->nullable(false)->change();
        });
    }
};
