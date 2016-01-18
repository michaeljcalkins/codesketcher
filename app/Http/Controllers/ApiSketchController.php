<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApiSketchController extends Controller
{
    public function index()
    {
        $sketches = \App\Sketch::whereUserId(\Auth::user()->id)
            ->get();

        return response()->json([
            'sketches' => $sketches
        ]);
    }

    public function find()
    {

    }

    public function create()
    {

    }

    public function update(Request $req, $id)
    {
        $success = \App\Sketch::whereId($id)
            ->whereUserId(\Auth::user()->id)
            ->update([
                'name' => $req->input('name'),
                'json' => $req->input('json')
            ]);

        $sketches = \App\Sketch::whereUserId(\Auth::user()->id)
            ->get();

        return response()->json([
            'sketches' => $sketches
        ]);
    }

    public function remove()
    {

    }
}
