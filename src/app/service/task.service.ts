import {Injectable} from '@angular/core';
import {Task} from "../model/task";
import {map, Observable} from "rxjs";
import {BACK_BASE_URL} from "../endpoints/endpoints";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PaginationResponse} from "../model/paginationResponse";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {
  }

  getTaskUrl(): string {
    return `${BACK_BASE_URL}`;
  }

  getAllTasks(page: number, pageSize: number): Observable<PaginationResponse> {
    const taskUrl = `${BACK_BASE_URL}/all`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    //console.log("taskUrl", taskUrl);
    return this.http.get<PaginationResponse>(taskUrl, { params }).pipe(
        map((paginationResponse: PaginationResponse) => {
          return paginationResponse;
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

}
