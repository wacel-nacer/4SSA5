import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Conference, ConferencePayload } from '../models/conference.model';

@Injectable({ providedIn: 'root' })
export class ConferenceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/conferences';

  getAll(): Observable<Conference[]> {
    return this.http.get<Conference[]>(this.apiUrl).pipe(
      map((conferences) => conferences.map((conference) => this.normalize(conference))),
    );
  }

  getById(id: number): Observable<Conference> {
    return this.http.get<Conference>(`${this.apiUrl}/${id}`).pipe(
      map((conference) => this.normalize(conference)),
    );
  }

  create(conference: ConferencePayload): Observable<Conference> {
    return this.http.post<Conference>(this.apiUrl, conference).pipe(
      map((created) => this.normalize(created)),
    );
  }

  update(id: number, conference: ConferencePayload): Observable<Conference> {
    return this.http.put<Conference>(`${this.apiUrl}/${id}`, conference).pipe(
      map((updated) => this.normalize(updated)),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalize(conference: Conference): Conference {
    return { ...conference, id: Number(conference.id) };
  }
}
