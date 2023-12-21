import {Injectable} from '@angular/core';
import {Task} from "../model/task";
import {map, Observable} from "rxjs";
import {BACK_BASE_URL} from "../endpoints/endpoints";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {
  }
  callCount = 0;

  getTaskUrl(): string {
    return `${BACK_BASE_URL}`;
  }

  getAllTasks(): Observable<Task[]> {
    const taskUrl = `${BACK_BASE_URL}/all`;
    console.log("taskUrl", taskUrl);
    return this.http.get<Task[]>(taskUrl).pipe(
        map((tasks: Task[]) => {
          return tasks;
        })
      )
  }

  getTaskById(): Observable<Task> {
    const taskUrl = this.getTaskUrl();
    let queryParams = new HttpParams().set('x', 2);
    return this.http.get<Task>(taskUrl, {params: queryParams}).pipe(
      map((task: Task) => {
        return task;
      })
    )
  }

  getUnCompletedTasks(): Observable<Task[]> {
    const taskUrl = `${BACK_BASE_URL}/todo`;

    return this.http.get<Task[]>(taskUrl).pipe(
        map((tasks: Task[]) => {
          return tasks;
        })
    )
  }

  addTask(task: Task) : Observable<String> {
    const taskUrl = `${BACK_BASE_URL}/add`;

    return this.http.post<String>(taskUrl, task);
  }

  markTaskAsDone(taskId: number | undefined) : Observable<String> {
    const taskUrl = `${BACK_BASE_URL}/${taskId}/status/edit`;

    return this.http.put<String>(taskUrl, null);
  }

  deleteTaskById() {
    const taskUrl = this.getTaskUrl();
    let queryParams = new HttpParams().set('x', 2);
    return this.http.get<Task[]>(taskUrl, {params: queryParams})
  }

}
