// interfaces/events.ts

export interface IEvent {
  id: number;
  name: string;
  location: string;
  date: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface IEventResponse {
  data: IEvent[];
  meta: {
    total: number;
  };
}
