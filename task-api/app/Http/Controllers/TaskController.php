<?php

namespace App\Http\Controllers;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request) {
        return $request->user()->tasks()->latest()->get();
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
        ]);

        $task = $request->user()->tasks()->create($data);
        return response()->json($task, 201);
    }

    public function show(Task $task) {
        $this->authorize('view', $task);
        return $task;
    }

    public function update(Request $request, Task $task) {
        $this->authorize('update', $task);
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
        ]);

        $task->update($data);
        return $task;
    }

    public function destroy(Task $task) {
        $this->authorize('delete', $task);
        $task->delete();
        return response()->noContent();
    }
}
