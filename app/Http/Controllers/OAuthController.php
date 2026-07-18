<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    /**
     * Redirect to the specified OAuth provider.
     */
    public function redirect(string $provider)
    {
        if (!in_array($provider, ['github', 'google', 'facebook'])) {
            abort(404);
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle provider authentication callback.
     */
    public function callback(string $provider)
    {
        if (!in_array($provider, ['github', 'google', 'facebook'])) {
            abort(404);
        }

        try {
            $socialiteUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal masuk menggunakan ' . ucfirst($provider));
        }

        $user = DB::transaction(function () use ($socialiteUser, $provider) {
            // Find existing social account
            $account = SocialAccount::where([
                'provider' => $provider,
                'provider_user_id' => $socialiteUser->getId(),
            ])->first();

            if ($account) {
                // Update tokens if changed
                $account->update([
                    'token' => $socialiteUser->token,
                    'refresh_token' => $socialiteUser->refreshToken,
                ]);

                return $account->user;
            }

            // Check if user already exists with the same email
            $user = User::where('email', $socialiteEmail = $socialiteUser->getEmail())->first();

            if (!$user) {
                // Create user with dynamic random credentials
                $user = User::create([
                    'name' => $socialiteUser->getName() ?? $socialiteUser->getNickname() ?? 'User',
                    'email' => $socialiteEmail ?: ($socialiteUser->getId() . '@' . $provider . '.com'),
                    'password' => Hash::make(Str::random(24)),
                    'email_verified_at' => now(),
                ]);

                // Assign Subscriber role
                $user->assignRole('Subscriber');

                // Create profile with OAuth avatar
                UserProfile::create([
                    'user_id' => $user->id,
                    'avatar' => $socialiteUser->getAvatar(),
                ]);
            }

            // Connect the social account
            SocialAccount::create([
                'user_id' => $user->id,
                'provider' => $provider,
                'provider_user_id' => $socialiteUser->getId(),
                'token' => $socialiteUser->token,
                'refresh_token' => $socialiteUser->refreshToken,
            ]);

            return $user;
        });

        // Authenticate the user session
        Auth::login($user, true);

        // Google OAuth (Gmail) users are restricted from the dashboard —
        // send them to the public homepage instead.
        if ($provider === 'google') {
            return redirect('/')->with([
                'flash' => [
                    'toast' => [
                        'type'    => 'success',
                        'message' => 'Berhasil masuk! Anda dapat membaca berita dan meninggalkan komentar.',
                    ],
                ],
            ]);
        }

        return redirect()->route('dashboard');
    }
}
