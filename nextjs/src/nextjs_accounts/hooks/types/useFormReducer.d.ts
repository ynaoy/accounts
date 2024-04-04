export type UserState = {
  userName: string;
  email: string;
  password: string;
}

export type UserAction =
  | { type: 'edited_userName'; userName: string }
  | { type: 'edited_email'; email: string }
  | { type: 'edited_password'; password: string }
  | { type: 'reset_form' };