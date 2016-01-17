<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::get('/features', 'HomeController@projects');
Route::get('/features/projects', 'FeaturesController@projects');
Route::get('/features/conversations', 'FeaturesController@projects');

Route::get('/', 'HomeController@index');

// Authentication routes...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

// Registration routes...
Route::get('auth/register', 'Auth\AuthController@getRegister');
Route::post('auth/register', 'Auth\AuthController@postRegister');

// Password reset link request routes...
Route::get('password/email', 'Auth\PasswordController@getEmail');
Route::post('password/email', 'Auth\PasswordController@postEmail');

// Password reset routes...
Route::get('password/reset/{token}', 'Auth\PasswordController@getReset');
Route::post('password/reset', 'Auth\PasswordController@postReset');

Route::group(['middleware' => ['auth']], function () {
    Route::get('home', 'AppController@index');
    Route::resource('api/attachments', 'ApiAttachmentController');
    Route::resource('api/teams', 'ApiTeamController');

    Route::put('api/me/team', 'ApiUserController@updateTeam');
    Route::put('api/me', 'ApiUserController@updateMe');
    Route::put('api/me/password', 'ApiUserController@updatePassword');
    Route::resource('api/users', 'ApiUserController');
});
