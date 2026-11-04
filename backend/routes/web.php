<?php

use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\PersonalAccessToken;

Route::get('/', function () {
    return redirect('/admin/kokpit');
});

Route::redirect('/admin', '/admin/kokpit');

Route::get('/panel/{subpath?}', function (Request $request) {
    if ($request->filled('sso_token')) {
        return redirect('/admin/sso?sso_token=' . urlencode((string) $request->query('sso_token')));
    }

    return redirect('/admin/kokpit');
})->where('subpath', '.*');

Route::get('/admin/sso', function (Request $request) {
    $rawToken = (string) $request->query('sso_token', '');
    if ($rawToken !== '') {
        $accessToken = PersonalAccessToken::findToken($rawToken);
        $user = $accessToken?->tokenable;
        if ($user instanceof User && $user->canAccessPanel(Filament::getPanel('admin'))) {
            // Unieważnienie jednorazowego tokenu SSO - ochrona przed ponownym użyciem z logów URL
            $accessToken->delete();

            Auth::guard('web')->login($user);
            $request->session()->regenerate();

            return redirect('/admin/kokpit');
        }
    }

    return redirect('/admin/logowanie');
});
