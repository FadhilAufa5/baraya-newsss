<?php

namespace App\Http\Controllers;

use App\Models\Email;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EmailController extends Controller
{
    public function index(Request $request): Response
    {
        $folder = $request->query('folder', 'inbox');
        $search = $request->query('search', '');
        $userId = Auth::id();

        $query = Email::where('user_id', $userId);

        if ($folder === 'trash') {
            $query = Email::onlyTrashed()->where('user_id', $userId);
        } elseif ($folder === 'sent') {
            $query->where('folder', 'sent')->where('status', 'sent');
        } elseif ($folder === 'draft') {
            $query->where('folder', 'draft')->where('status', 'draft');
        } elseif ($folder === 'starred') {
            $query->where('is_starred', true);
        } else {
            $query->where('folder', 'inbox');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('to_email', 'like', "%{$search}%")
                  ->orWhere('to_name', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%");
            });
        }

        $emails = $query->orderByDesc('created_at')->paginate(20)->through(fn ($e) => [
            'id'         => $e->id,
            'to_email'   => $e->to_email,
            'to_name'    => $e->to_name,
            'subject'    => $e->subject,
            'body'       => $e->body,
            'status'     => $e->status,
            'folder'     => $e->folder,
            'is_read'    => $e->is_read,
            'is_starred' => $e->is_starred,
            'cc'         => $e->cc,
            'bcc'        => $e->bcc,
            'sent_at'    => $e->sent_at?->diffForHumans(),
            'created_at' => $e->created_at?->format('d M Y, H:i'),
        ]);

        $counts = [
            'inbox'   => Email::where('user_id', $userId)->where('folder', 'inbox')->count(),
            'sent'    => Email::where('user_id', $userId)->where('folder', 'sent')->count(),
            'draft'   => Email::where('user_id', $userId)->where('folder', 'draft')->count(),
            'starred' => Email::where('user_id', $userId)->where('is_starred', true)->count(),
            'trash'   => Email::onlyTrashed()->where('user_id', $userId)->count(),
            'unread'  => Email::where('user_id', $userId)->where('folder', 'inbox')->where('is_read', false)->count(),
        ];

        $users = User::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('mail/index', [
            'emails'  => $emails,
            'counts'  => $counts,
            'folder'  => $folder,
            'filters' => ['search' => $search, 'folder' => $folder],
            'users'   => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'to_email' => 'required|email',
            'to_name'  => 'nullable|string|max:255',
            'subject'  => 'required|string|max:255',
            'body'     => 'required|string',
            'cc'       => 'nullable|string|max:255',
            'bcc'      => 'nullable|string|max:255',
            'action'   => 'required|in:send,draft',
        ]);

        $isSend = $request->action === 'send';

        Email::create([
            'user_id'  => Auth::id(),
            'to_email' => $request->to_email,
            'to_name'  => $request->to_name,
            'subject'  => $request->subject,
            'body'     => $request->body,
            'cc'       => $request->cc,
            'bcc'      => $request->bcc,
            'status'   => $isSend ? 'sent' : 'draft',
            'folder'   => $isSend ? 'sent' : 'draft',
            'sent_at'  => $isSend ? now() : null,
        ]);

        return back()->with('success', $isSend ? 'Email berhasil dikirim!' : 'Draft tersimpan.');
    }

    public function markRead(Request $request, Email $email)
    {
        $email->update(['is_read' => true]);
        return back();
    }

    public function toggleStar(Request $request, Email $email)
    {
        $email->update(['is_starred' => !$email->is_starred]);
        return back();
    }

    public function destroy(Email $email)
    {
        $email->delete(); // soft delete → trash
        return back()->with('success', 'Email dipindahkan ke Sampah.');
    }

    public function forceDelete(Request $request, $id)
    {
        $email = Email::onlyTrashed()->findOrFail($id);
        $email->forceDelete();
        return back()->with('success', 'Email dihapus permanen.');
    }

    public function restore($id)
    {
        $email = Email::onlyTrashed()->findOrFail($id);
        $email->restore();
        $email->update(['folder' => 'inbox']);
        return back()->with('success', 'Email dipulihkan.');
    }
}
