import { Timestamp } from '@angular/fire/firestore';

import { CurrentUser } from './current-user';

export type Review = {
  id: string;
  title: string;
  body: string;
  rating: number;
  createdAt: Timestamp;
  author: Omit<CurrentUser, 'email'>;
};
