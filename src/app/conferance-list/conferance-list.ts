import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Conference } from '../models/conference.model';
import { ConferenceService } from '../services/conference.service';

@Component({
  selector: 'app-conferance-list',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './conferance-list.html',
  styleUrl: './conferance-list.css',
})
export class ConferanceList implements OnInit {
  private readonly conferenceService = inject(ConferenceService);
  readonly conferences = signal<Conference[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly deletingId = signal<number | null>(null);
  readonly error = signal('');
  readonly filteredConferences = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.conferences().filter((conference) =>
      !query || [conference.name, conference.place, conference.description ?? '']
        .some((value) => value.toLowerCase().includes(query)),
    );
  });

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.loading.set(true);
    this.error.set('');
    this.conferenceService.getAll().subscribe({
      next: (conferences) => this.conferences.set(conferences),
      error: (error: HttpErrorResponse) => {
        this.error.set(this.getErrorMessage(error));
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  deleteConference(conference: Conference): void {
    if (!confirm(`Supprimer la conférence « ${conference.name} » ?`)) return;
    this.deletingId.set(conference.id);
    this.error.set('');
    this.conferenceService.delete(conference.id).subscribe({
      next: () => this.conferences.update((items) => items.filter((item) => item.id !== conference.id)),
      error: (error: HttpErrorResponse) => this.error.set(this.getErrorMessage(error)),
      complete: () => this.deletingId.set(null),
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return error.status === 0
      ? 'API indisponible. Démarrez json-server sur le port 3000.'
      : `La requête a échoué (${error.status}).`;
  }
}
