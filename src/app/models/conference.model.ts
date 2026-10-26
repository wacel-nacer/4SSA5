export interface Conference {
  id: number;
  name: string;
  date: string;
  place: string;
  description?: string;
  imageUrl?: string;
}

export type ConferencePayload = Omit<Conference, 'id'>;
