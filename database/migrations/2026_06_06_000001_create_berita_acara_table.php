<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berita_acara', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat')->unique();
            $table->string('judul');
            $table->date('tanggal_acara');
            $table->time('waktu_mulai')->nullable();
            $table->time('waktu_selesai')->nullable();
            $table->string('tempat');
            $table->string('pimpinan_rapat');
            $table->string('notulis');
            $table->text('agenda');
            $table->longText('isi_pembahasan');
            $table->text('kesimpulan')->nullable();
            $table->text('tindak_lanjut')->nullable();
            $table->enum('status', ['draft', 'menunggu', 'disetujui', 'ditolak'])->default('draft');
            $table->text('catatan_status')->nullable();
            $table->json('peserta')->nullable();
            $table->json('penandatangan')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berita_acara');
    }
};
