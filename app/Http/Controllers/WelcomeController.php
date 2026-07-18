<?php

namespace App\Http\Controllers;

use App\Services\NewsFeedService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function __construct(private NewsFeedService $feedService) {}

    public function index(Request $request)
    {
        $search   = $request->input('search', '');
        $category = $request->input('category', '');

        $data = $this->feedService->getFeedData($search, $category);

        return Inertia::render('welcome', array_merge($data, [
            'filters' => $request->only(['search', 'category']),
        ]));
    }
}
