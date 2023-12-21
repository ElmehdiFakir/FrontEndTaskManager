import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../service/task.service';
import {Task} from '../model/task';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  tasks: Task[] = [];
  searchedTask: Task | undefined;
  searchedTasks: Task[] = [];

  unCompletedTasks: Task[] = [];
  newTask: Task = {id: 0, label: '', completed: false}; // Nouvelle tâche à ajouter

  formError: string | null = null;


  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks(): void {
    this.taskService
      .getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
        },
        complete: () => {
          console.log('Get all tasks done');
        },
        error: (error) => {
          console.error('Error getting all tasks', error);
        },
      });
  }

  getTaskById(id: number): void {
    this.taskService
      .getTaskById()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task: Task) => {
          this.searchedTask = task;
        },
        complete: () => {
          console.log('Found 1 or more task(s) done');
        },
        error: (error) => {
          console.error(`Error searching task with id ${id}`, error);
        },
      });
  }

  searchTasksByStatus(): void {
    this.taskService
      .getUnCompletedTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (unCompletedTasks: Task[]) => {
          this.unCompletedTasks = unCompletedTasks;
        },
        complete: () => {
          console.log('Get uncompleted tasks done');
        },
        error: (error) => {
          console.error('Error getting uncompleted tasks', error);
        },
      });
  }

  addTask(task: Task): void {
    this.taskService.addTask(task).subscribe({
      next: (response : String) => {
        this.getAllTasks();
        console.log(response);
      },
      error: (error) => {
        console.error('Error adding task', error);
      },
    });
  }


  addNewTask(form: NgForm): void {
    const label = form.value.label;
    const status = form.value.status === 'true';

    // Vérifiez si le libellé est non vide avant d'ajouter
    if (label.trim() !== '') {
      const newTask: Task = { label: label, completed: status };
      this.addTask(newTask);

      // Réinitialisez le formulaire après l'ajout de la tâche
      form.resetForm({ label: '', status: 'true' });

      // Réinitialisez la variable d'erreur
      this.formError = null;
    } else {
      // Si le libellé est vide, définissez la variable d'erreur
      this.formError = 'Veuillez remplir tous les champs du formulaire.';
    }
  }

  markTaskAsDone(): void {
      const taskToMarkAsDone: Task = this.unCompletedTasks[0];

      this.taskService.markTaskAsDone(taskToMarkAsDone.id).subscribe({
        next: (response: String) => {
          console.log(response);
          this.getAllTasks();
          this.searchTasksByStatus(); // Mettez à jour la liste des tâches non terminées après la modification du statut
        },
        error: (error: any) => {
          console.error('Error marking task as done', error);
        },
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
