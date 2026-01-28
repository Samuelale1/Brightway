<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    \Illuminate\Support\Facades\Log::info("Broadcasting auth check: user_id={$user->id}, requested_id={$id}");
    return (int) $user->id === (int) $id;
});
