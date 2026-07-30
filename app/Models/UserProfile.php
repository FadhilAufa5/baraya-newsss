<?php

namespace App\Models;

use App\Concerns\HasMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory, HasMedia;

    protected $fillable = [
        'user_id',
        'avatar',
        'cover_image',
        'bio',
        'website',
        'social_links', // will be casted as array/json
    ];

    protected $casts = [
        'social_links' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
