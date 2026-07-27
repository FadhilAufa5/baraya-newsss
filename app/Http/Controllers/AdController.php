<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdController extends Controller
{
    public function index(Request $request)
    {
        $query = Ad::query()->latest();

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $iklan = $query->paginate(15)->withQueryString();

        return Inertia::render('iklan/index', [
            'ads' => $iklan,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    public function create()
    {
        return Inertia::render('iklan/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'sponsor_name' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:500'],
            'cta_text' => ['required', 'string', 'max:50'],
            'cta_url' => ['required', 'url', 'max:500'],
            'type' => ['required', 'in:leaderboard,in-feed,rectangle'],
            'position' => ['required', 'in:top,middle,sidebar'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['starts_at'] = $validated['starts_at'] ?: null;
        $validated['ends_at'] = $validated['ends_at'] ?: null;

        Ad::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Iklan berhasil ditambahkan.']);

        return to_route('iklan.index');
    }

    public function edit(Ad $ad)
    {
        return Inertia::render('iklan/edit', [
            'ad' => $ad,
        ]);
    }

    public function update(Request $request, Ad $ad): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'sponsor_name' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:500'],
            'cta_text' => ['required', 'string', 'max:50'],
            'cta_url' => ['required', 'url', 'max:500'],
            'type' => ['required', 'in:leaderboard,in-feed,rectangle'],
            'position' => ['required', 'in:top,middle,sidebar'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['starts_at'] = $validated['starts_at'] ?: null;
        $validated['ends_at'] = $validated['ends_at'] ?: null;

        $ad->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Iklan berhasil diperbarui.']);

        return to_route('iklan.index');
    }

    public function destroy(Ad $ad): RedirectResponse
    {
        $ad->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Iklan berhasil dihapus.']);

        return to_route('iklan.index');
    }

    public function toggle(Ad $ad): RedirectResponse
    {
        $newState = !$ad->is_active;
        $ad->update(['is_active' => $newState]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $newState ? 'Iklan diaktifkan.' : 'Iklan dinonaktifkan.',
        ]);

        return back();
    }
}
