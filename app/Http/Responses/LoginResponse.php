<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = Auth::user();

        // Check if user has permission to access dashboard
        if ($user && !$user->can('access dashboard')) {
            // Redirect to home if they don't have dashboard access
            return redirect()->intended('/');
        }

        return redirect()->intended(config('fortify.home'));
    }
}
