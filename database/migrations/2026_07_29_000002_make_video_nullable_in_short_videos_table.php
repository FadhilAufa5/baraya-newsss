<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('short_videos', function (Blueprint $table) {
            $table->string('video')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('short_videos', function (Blueprint $table) {
            $table->string('video')->nullable(false)->change();
        });
    }
};
