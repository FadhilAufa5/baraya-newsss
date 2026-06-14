<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BeritaAcaraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_surat'    => ['required', 'string', 'max:100'],
            'judul'          => ['required', 'string', 'max:255'],
            'tanggal_acara'  => ['required', 'date'],
            'waktu_mulai'    => ['nullable', 'date_format:H:i'],
            'waktu_selesai'  => ['nullable', 'date_format:H:i'],
            'tempat'         => ['required', 'string', 'max:255'],
            'pimpinan_rapat' => ['required', 'string', 'max:255'],
            'notulis'        => ['required', 'string', 'max:255'],
            'agenda'         => ['required', 'string'],
            'isi_pembahasan' => ['required', 'string'],
            'kesimpulan'     => ['nullable', 'string'],
            'tindak_lanjut'  => ['nullable', 'string'],
            'peserta'        => ['nullable', 'array'],
            'peserta.*'      => ['string'],
            'penandatangan'  => ['nullable', 'array'],
            'penandatangan.*.nama'   => ['string'],
            'penandatangan.*.jabatan' => ['string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nomor_surat'    => 'Nomor Surat',
            'judul'          => 'Judul',
            'tanggal_acara'  => 'Tanggal Acara',
            'waktu_mulai'    => 'Waktu Mulai',
            'waktu_selesai'  => 'Waktu Selesai',
            'tempat'         => 'Tempat',
            'pimpinan_rapat' => 'Pimpinan Rapat',
            'notulis'        => 'Notulis',
            'agenda'         => 'Agenda',
            'isi_pembahasan' => 'Isi Pembahasan',
            'kesimpulan'     => 'Kesimpulan',
            'tindak_lanjut'  => 'Tindak Lanjut',
        ];
    }
}
