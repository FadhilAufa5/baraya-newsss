<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // sender
            $table->string('to_email');
            $table->string('to_name')->nullable();
            $table->string('subject');
            $table->longText('body');
            $table->enum('status', ['draft', 'sent', 'failed'])->default('draft');
            $table->string('folder')->default('inbox'); // inbox, sent, draft, trash
            $table->boolean('is_read')->default(false);
            $table->boolean('is_starred')->default(false);
            $table->string('cc')->nullable();
            $table->string('bcc')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['user_id', 'folder']);
            $table->index('status');
            $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emails');
    }
};
