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
  private rooms: Room[] = [
    {
      id: 1,
      roomNo: '101',
      roomType: 'Single',
      acNonAc: 'AC',
      meal: 'Included',
      capacity: 1,
      rent: '1500',
    },
    {
      id: 2,
      roomNo: '102',
      roomType: 'Double',
      acNonAc: 'Non-AC',
      meal: 'Not Included',
      capacity: 2,
      rent: '2500',
    },
    {
      id: 3,
      roomNo: 'A-201',
      roomType: 'Apartment',
      acNonAc: 'AC',
      meal: 'Included',
      capacity: 4,
      rent: '5000',
    },
  ];

  constructor() {}

  getRooms(): Room[] {
    return this.rooms;
  }

  addRoom(room: Room): void {
    room.id = this.rooms.length > 0 ? Math.max(...this.rooms.map((r) => r.id)) + 1 : 1;
    this.rooms.push(room);
  }

  updateRoom(updatedRoom: Room): void {
    const index = this.rooms.findIndex((r) => r.id === updatedRoom.id);
    if (index !== -1) {
      this.rooms[index] = updatedRoom;
    }
  }

  deleteRoom(id: number): void {
    this.rooms = this.rooms.filter((r) => r.id !== id);
  }
}
