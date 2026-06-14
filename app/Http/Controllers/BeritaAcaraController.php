<?php

namespace App\Http\Controllers;

use App\Http\Requests\BeritaAcaraRequest;
use App\Models\BeritaAcara;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaAcaraController extends Controller
{
    public function index(Request $request)
    {
        $query = BeritaAcara::with('user')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('nomor_surat', 'like', "%{$search}%")
                  ->orWhere('pimpinan_rapat', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $beritaAcara = $query->paginate(10)->withQueryString();

        return Inertia::render('berita-acara/index', [
            'beritaAcara' => $beritaAcara,
            'filters'     => $request->only(['search', 'status']),
        ]);
    }

    public function store(BeritaAcaraRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        BeritaAcara::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita Acara berhasil dibuat.']);

        return to_route('berita-acara.index');
    }

    public function update(BeritaAcaraRequest $request, BeritaAcara $beritaAcara): RedirectResponse
    {
        $beritaAcara->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita Acara berhasil diperbarui.']);

        return to_route('berita-acara.index');
    }

    public function destroy(BeritaAcara $beritaAcara): RedirectResponse
    {
        $beritaAcara->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berita Acara berhasil dihapus.']);

        return to_route('berita-acara.index');
    }

    public function updateStatus(Request $request, BeritaAcara $beritaAcara): RedirectResponse
    {
        $validated = $request->validate([
            'status'         => ['required', 'in:draft,menunggu,disetujui,ditolak'],
            'catatan_status' => ['nullable', 'string', 'max:500'],
        ]);

        $beritaAcara->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status berhasil diperbarui.']);

        return to_route('berita-acara.index');
    }
}
