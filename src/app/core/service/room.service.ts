import { Injectable } from '@angular/core';

export interface Room {
  id: number;
  roomNo: string;
  roomType: string;
  acNonAc: string;
  meal: string;
  capacity: number;
  rent: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly STORAGE_KEY = 'hms_rooms_list';
  private rooms: Room[] = this.loadFromStorage();

  constructor() {}

  private loadFromStorage(): Room[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.rooms));
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  addRoom(room: Room): void {
    room.id = this.rooms.length > 0 ? Math.max(...this.rooms.map((r) => r.id)) + 1 : 1;
    this.rooms.push(room);
    this.saveToStorage();
  }

  updateRoom(updatedRoom: Room): void {
    const index = this.rooms.findIndex((r) => r.id === updatedRoom.id);
    if (index !== -1) {
      this.rooms[index] = updatedRoom;
      this.saveToStorage();
    }
  }

  deleteRoom(id: number): void {
    this.rooms = this.rooms.filter((r) => r.id !== id);
    this.saveToStorage();
  }
}
