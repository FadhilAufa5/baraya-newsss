<?php

namespace App\Http\Controllers;

use App\Models\News;
use Inertia\Inertia;
use Inertia\Response;

class CompanyPageController extends Controller
{
    /**
     * Dapatkan data berita populer dan terbaru untuk sidebar kanan
     */
    private function getCommonData(): array
    {
        $beritaTerpopuler = News::published()
            ->orderByDesc('views')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at', 'views']);

        $beritaTerbaru = News::published()
            ->latest('published_at')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'category', 'image', 'published_at', 'views']);

        $trendingItems = News::published()
            ->orderByDesc('views')
            ->limit(5)
            ->pluck('title')
            ->all();

        return [
            'beritaTerpopuler' => $beritaTerpopuler,
            'beritaTerbaru'    => $beritaTerbaru,
            'trendingItems'    => $trendingItems,
        ];
    }

    /**
     * Tampilkan halaman Kebijakan Privasi
     */
    public function privacy(): Response
    {
        return Inertia::render('company/privacy', $this->getCommonData());
    }

    /**
     * Tampilkan halaman Susunan Redaksi
     */
    public function editorial(): Response
    {
        return Inertia::render('company/editorial', $this->getCommonData());
    }

    /**
     * Tampilkan halaman Pedoman Media Siber
     */
    public function cyberGuidelines(): Response
    {
        return Inertia::render('company/cyber-guidelines', $this->getCommonData());
    }

    /**
     * Tampilkan halaman Kontak & Kantor
     */
    public function contact(): Response
    {
        return Inertia::render('company/contact', $this->getCommonData());
    }

    /**
     * Tampilkan halaman Syarat Karya Tulis
     */
    public function writingTerms(): Response
    {
        return Inertia::render('company/writing-terms', $this->getCommonData());
    }
}
