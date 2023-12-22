import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskService} from '../service/task.service';
import {Task} from '../model/task';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgForm} from "@angular/forms";
import {PaginationResponse} from "../model/paginationResponse";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  tasks: Task[] = [];
  searchedTask: Task | undefined;
  totalTasks: number = 0;
  tasksPerPage: number = 2;
  currentPage: number = 1;

  unCompletedTasks: Task[] = [];

  formError: string | null = null;


  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.getAllTasks(this.currentPage, this.tasksPerPage);
  }

  getAllTasks(page: number, pageSize: number): void {
    this.taskService
      .getAllTasks(page-1, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response : PaginationResponse) => {
          console.log("RESPONSE", response);
          this.tasks = response.content;
          this.totalTasks = response.totalElements;
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

  addTask(task: Task, onSuccess: () => void): void {
    this.taskService.addTask(task).subscribe({
      next: (response : String) => {
        onSuccess();
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
      this.addTask(newTask, () => {
        this.getAllTasks(1,this.tasksPerPage);
      });

      // Réinitialisez le formulaire après l'ajout de la tâche
      form.resetForm({ label: '', status: 'true' });

      // Réinitialisez la variable d'erreur
      this.formError = null;
    } else {
      // Si le libellé est vide, définissez la variable d'erreur
      this.formError = 'Veuillez remplir tous les champs du formulaire.';
    }
  }

  markTaskAsDone(task: Task): void {

      this.taskService.markTaskAsDone(task.id).subscribe({
        next: (response: String) => {
          this.getAllTasks(1, this.tasksPerPage);
          this.searchTasksByStatus();
        },
        error: (error: any) => {
          console.error('Error marking task as done', error);
        },
      });
  }

  changePage(offset: number): void {
    const newPage = this.currentPage + offset;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage = newPage;
      this.getAllTasks(this.currentPage, this.tasksPerPage);
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalTasks / this.tasksPerPage);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly console = console;
}
