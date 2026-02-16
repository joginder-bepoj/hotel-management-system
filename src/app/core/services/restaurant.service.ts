import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
}

export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  activeOrderId?: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  type: 'Room Service' | 'Dine-in';
  roomNumber?: string;
  tableNumber?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';
  createdAt: Date;
  isPaid: boolean;
  paymentMode?: string;
  postedToRoom?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly STORAGE_KEY = 'restaurant_details';
  private readonly USER_KEY = 'user';

  private menuItems: MenuItem[] = [
    { id: 1, name: 'Paneer Butter Masala', category: 'Main Course', price: 350, isActive: true },
    { id: 2, name: 'Chicken Tikka', category: 'Starters', price: 280, isActive: true },
    { id: 3, name: 'Roti', category: 'Main Course', price: 20, isActive: true },
    { id: 4, name: 'Gulab Jamun', category: 'Desserts', price: 80, isActive: true },
    { id: 5, name: 'Masala Dosa', category: 'Main Course', price: 120, isActive: true },
    { id: 6, name: 'Coffee', category: 'Beverages', price: 60, isActive: true },
    { id: 7, name: 'Spring Roll', category: 'Starters', price: 150, isActive: true },
    { id: 8, name: 'Ice Cream', category: 'Desserts', price: 100, isActive: true },
  ];

  private tables: Table[] = [
    { id: 1, tableNumber: 'T1', capacity: 2, status: 'Available' },
    { id: 2, tableNumber: 'T2', capacity: 4, status: 'Occupied', activeOrderId: 1 },
    { id: 3, tableNumber: 'T3', capacity: 4, status: 'Available' },
    { id: 4, tableNumber: 'T4', capacity: 6, status: 'Reserved' },
    { id: 5, tableNumber: 'T5', capacity: 2, status: 'Available' },
    { id: 6, tableNumber: 'T6', capacity: 8, status: 'Available' },
  ];

  private orders: Order[] = [
    {
      id: 1,
      orderNumber: 'ORD-1001',
      type: 'Dine-in',
      tableNumber: 'T2',
      items: [
        { menuItem: this.menuItems[0], quantity: 2 },
        { menuItem: this.menuItems[2], quantity: 4 }
      ],
      subtotal: 780,
      tax: 140.4,
      total: 920.4,
      status: 'Preparing',
      createdAt: new Date(),
      isPaid: false
    },
    {
      id: 2,
      orderNumber: 'ORD-1002',
      type: 'Room Service',
      roomNumber: '203',
      items: [
        { menuItem: this.menuItems[1], quantity: 1 },
        { menuItem: this.menuItems[5], quantity: 2 }
      ],
      subtotal: 400,
      tax: 72,
      total: 472,
      status: 'Ready',
      createdAt: new Date(Date.now() - 1800000),
      isPaid: false
    }
  ];

  private nextOrderId = 3;
  private nextOrderNumber = 1003;

  constructor() { }

  // Setup Methods
  saveRestaurantDetails(details: any): Observable<boolean> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(details));

      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        const user = JSON.parse(userStr);
        user.isSetupComplete = true;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }

      return of(true);
    } catch (e) {
      console.error('Error saving restaurant details', e);
      return of(false);
    }
  }

  getRestaurantDetails(): any {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Menu Methods
  getMenuItems(): MenuItem[] {
    return [...this.menuItems];
  }

  getActiveMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isActive);
  }

  getMenuItemsByCategory(category: string): MenuItem[] {
    return this.menuItems.filter(item => item.category === category && item.isActive);
  }

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: Math.max(...this.menuItems.map(i => i.id), 0) + 1
    };
    this.menuItems.push(newItem);
    return newItem;
  }

  updateMenuItem(item: MenuItem): void {
    const index = this.menuItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.menuItems[index] = item;
    }
  }

  disableMenuItem(id: number): void {
    const item = this.menuItems.find(i => i.id === id);
    if (item) {
      item.isActive = false;
    }
  }

  // Table Methods
  getTables(): Table[] {
    return [...this.tables];
  }

  getAvailableTables(): Table[] {
    return this.tables.filter(t => t.status === 'Available');
  }

  updateTableStatus(id: number, status: Table['status'], activeOrderId?: number): void {
    const table = this.tables.find(t => t.id === id);
    if (table) {
      table.status = status;
      table.activeOrderId = activeOrderId;
    }
  }

  // Order Methods
  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  getPendingOrders(): Order[] {
    return this.orders.filter(o => !o.isPaid);
  }

  getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter(o => o.status === status);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: this.nextOrderId++,
      orderNumber: `ORD-${this.nextOrderNumber++}`,
      createdAt: new Date()
    };
    this.orders.push(newOrder);

    if (newOrder.type === 'Dine-in' && newOrder.tableNumber) {
      const table = this.tables.find(t => t.tableNumber === newOrder.tableNumber);
      if (table) {
        table.status = 'Occupied';
        table.activeOrderId = newOrder.id;
      }
    }

    return newOrder;
  }

  updateOrderStatus(id: number, status: Order['status']): void {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
    }
  }

  markOrderPaid(id: number, paymentMode: string, postedToRoom?: boolean): void {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.isPaid = true;
      order.paymentMode = paymentMode;
      order.postedToRoom = postedToRoom;

      if (order.type === 'Dine-in' && order.tableNumber) {
        const table = this.tables.find(t => t.tableNumber === order.tableNumber);
        if (table) {
          table.status = 'Available';
          table.activeOrderId = undefined;
        }
      }
    }
  }

  // Statistics
  getTodaysSales(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.orders
      .filter(o => o.createdAt >= today && o.isPaid)
      .reduce((sum, o) => sum + o.total, 0);
  }

  getTodaysOrderCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.orders.filter(o => o.createdAt >= today).length;
  }

  getRoomServiceCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.orders.filter(o => o.createdAt >= today && o.type === 'Room Service').length;
  }

  getDineInCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.orders.filter(o => o.createdAt >= today && o.type === 'Dine-in').length;
  }

  getPendingKitchenOrders(): number {
    return this.orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
  }
}
