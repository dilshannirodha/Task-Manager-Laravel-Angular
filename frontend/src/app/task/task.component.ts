import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // You'll need to create this service

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'pending',
    due_date: ''
  };
  editingTaskId: number | null = null;
  originalTask: Task | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  addTask(): void {
    if (!this.newTask.title) return;
    
    this.taskService.createTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.unshift(task);
        this.newTask = { title: '', description: '', status: 'pending', due_date: '' };
      },
      error: (err) => {
        console.error('Error creating task:', err);
      }
    });
  }

  editTask(task: Task): void {
    if (this.editingTaskId === task.id) {
      this.cancelEdit();
      return;
    }
    
    if (this.editingTaskId !== null) {
      this.cancelEdit();
    }
    
    this.editingTaskId = task.id;
    this.originalTask = JSON.parse(JSON.stringify(task));
  }

  saveEdit(task: Task): void {
    if (!this.editingTaskId) return;
    
    this.taskService.updateTask(this.editingTaskId, task).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.editingTaskId = null;
        this.originalTask = null;
      },
      error: (err) => {
        console.error('Error updating task:', err);
      }
    });
  }

  cancelEdit(): void {
    if (this.originalTask && this.editingTaskId) {
      const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
      if (index !== -1) {
        this.tasks[index] = this.originalTask;
      }
    }
    this.editingTaskId = null;
    this.originalTask = null;
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== id);
        },
        error: (err) => {
          console.error('Error deleting task:', err);
        }
      });
    }
  }

  logout(): void {
  
        this.router.navigate(['/login']);
    
    
  }
}