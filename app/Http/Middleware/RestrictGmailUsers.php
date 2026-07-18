<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictGmailUsers
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && str_ends_with(strtolower($user->email), '@gmail.com')) {
            return redirect('/')->with([
                'flash' => [
                    'toast' => [
                        'type' => 'error',
                        'message' => 'Pengguna dengan akun Gmail tidak diizinkan mengakses halaman pengaturan.',
                    ]
                ]
            ]);
        }

        return $next($request);
    }
}
