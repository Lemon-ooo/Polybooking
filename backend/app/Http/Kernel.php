<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

// Core middlewares (dùng bản trong framework, không cần bản trong App\Http\Middleware)
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Foundation\Http\Middleware\ValidatePostSize;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Routing\Middleware\ValidateSignature;
use Illuminate\Http\Middleware\SetCacheHeaders;

// Auth-related middlewares (framework)
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\AuthenticateWithBasicAuth;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Auth\Middleware\Authorize;
use Illuminate\Auth\Middleware\RequirePassword;

// Middleware custom của bro
use App\Http\Middleware\IsAdmin;

class Kernel extends HttpKernel
{
    /**
     * Global middleware – chạy trên mọi request.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        HandleCors::class,
        ValidatePostSize::class,
        ConvertEmptyStringsToNull::class,
    ];

    /**
     * Middleware groups: web, api.
     *
     * @var array<string, array<int, class-string|string>>
     */
    protected $middlewareGroups = [
        'web' => [
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
            VerifyCsrfToken::class,
            SubstituteBindings::class,
        ],

        'api' => [
            ThrottleRequests::class . ':api',
            SubstituteBindings::class,
        ],
    ];

    /**
     * Route middleware – gắn theo alias.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        // Auth
        'auth'            => Authenticate::class,
        'auth.basic'      => AuthenticateWithBasicAuth::class,
        'auth.session'    => AuthenticateSession::class,

        // Guest (chặn login/register khi đã đăng nhập)
        'guest'           => RedirectIfAuthenticated::class,

        // Authorization / verified
        'can'             => Authorize::class,
        'verified'        => EnsureEmailIsVerified::class,
        'password.confirm'=> RequirePassword::class,

        // Various
        'throttle'        => ThrottleRequests::class,
        'signed'          => ValidateSignature::class,
        'cache.headers'   => SetCacheHeaders::class,

        // 🔥 alias phân quyền admin
        // 'is_admin'        => IsAdmin::class,
    ];

    protected function schedule(\Illuminate\Console\Scheduling\Schedule $schedule)
{
    $schedule->command('events:send-start-mail')->dailyAt('08:00');
}
}
