<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Email extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'to_email',
        'to_name',
        'subject',
        'body',
        'status',
        'folder',
        'is_read',
        'is_starred',
        'cc',
        'bcc',
        'sent_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_starred' => 'boolean',
        'sent_at' => 'datetime',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeInbox($query)
    {
        return $query->where('folder', 'inbox');
    }

    public function scopeSent($query)
    {
        return $query->where('folder', 'sent')->where('status', 'sent');
    }

    public function scopeDraft($query)
    {
        return $query->where('folder', 'draft')->where('status', 'draft');
    }

    public function scopeTrash($query)
    {
        return $query->onlyTrashed();
    }
}
