import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConferencePayload } from '../models/conference.model';
import { ConferenceService } from '../services/conference.service';

@Component({
  selector: 'app-conferance-details',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './conferance-details.html',
  styleUrl: './conferance-details.css',
})
export class ConferanceDetails implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly conferenceService = inject(ConferenceService);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
    place: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', Validators.maxLength(500)],
    imageUrl: [''],
  });
  readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  readonly formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  readonly characterCount = computed(() => (this.formValue().description ?? '').length);
  readonly isValid = computed(() => this.formStatus() === 'VALID');
  readonly isEditing = computed(() => this.route.snapshot.paramMap.has('id'));
  saving = false;
  error = '';
  private conferenceId?: number;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.conferenceId = Number(id);
      this.loadConference(this.conferenceId);
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.error = '';
    const payload: ConferencePayload = this.form.getRawValue();
    const request = this.conferenceId
      ? this.conferenceService.update(this.conferenceId, payload)
      : this.conferenceService.create(payload);
    request.subscribe({
      next: () => this.router.navigate(['/list']),
      error: (error: HttpErrorResponse) => {
        this.error = error.status === 0
          ? 'API indisponible. Démarrez json-server sur le port 3000.'
          : `Impossible d'enregistrer la conférence (${error.status}).`;
        this.saving = false;
      },
    });
  }

  private loadConference(id: number): void {
    this.conferenceService.getById(id).subscribe({
      next: (conference) => this.form.patchValue(conference),
      error: (error: HttpErrorResponse) => {
        this.error = error.status === 404 ? 'Cette conférence est introuvable.' : 'Impossible de charger la conférence.';
      },
    });
  }
}
