<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BeritaAcara extends Model
{
    use HasFactory;

    protected $table = 'berita_acara';

    protected $fillable = [
        'nomor_surat',
        'judul',
        'tanggal_acara',
        'waktu_mulai',
        'waktu_selesai',
        'tempat',
        'pimpinan_rapat',
        'notulis',
        'agenda',
        'isi_pembahasan',
        'kesimpulan',
        'tindak_lanjut',
        'status',
        'catatan_status',
        'peserta',
        'penandatangan',
        'user_id',
    ];

    protected $casts = [
        'tanggal_acara' => 'date',
        'peserta' => 'array',
        'penandatangan' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'draft'     => 'Draft',
            'menunggu'  => 'Menunggu',
            'disetujui' => 'Disetujui',
            'ditolak'   => 'Ditolak',
            default     => '-',
        };
    }
}
