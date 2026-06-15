<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'slug'             => ['nullable', 'string', 'max:255', 'unique:news,slug'],
            'category'         => ['required', 'string', 'max:100'],
            'author'           => ['nullable', 'string', 'max:150'],
            'excerpt'          => ['nullable', 'string', 'max:500'],
            'content'          => ['required', 'string'],
            'image'            => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'image_caption'    => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:160'],
            'tags'             => ['nullable', 'array'],
            'tags.*'           => ['string', 'max:50'],
            'status'           => ['required', 'in:draft,published,archived'],
            'is_featured'      => ['boolean'],
            'published_at'     => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'   => 'Judul artikel wajib diisi.',
            'content.required' => 'Konten artikel wajib diisi.',
            'category.required'=> 'Kategori wajib dipilih.',
            'image.image'      => 'File harus berupa gambar.',
            'image.max'        => 'Ukuran gambar maksimal 4MB.',
        ];
    }
}
