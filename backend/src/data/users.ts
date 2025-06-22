// src/data/users.ts
import { User } from '../models/User';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'users.json');

export function getUsers(): User[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function saveUsers(users: User[]) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
}
