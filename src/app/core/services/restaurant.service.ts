import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
  mobile?: string;
  remark?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly STORAGE_KEY = 'restaurant_details';
  private readonly USER_KEY = 'user';
  private readonly MENU_ITEMS_KEY = 'restaurant_menu_items';
  private readonly TABLES_KEY = 'restaurant_tables';
  private readonly ORDERS_KEY = 'restaurant_orders';

  // INITIAL MOCK DATA
  private initialMenuItems: MenuItem[] = [
    { id: 1, name: 'Paneer Butter Masala', category: 'Main Course', price: 350, isActive: true },
    { id: 2, name: 'Chicken Tikka', category: 'Starters', price: 280, isActive: true },
    { id: 3, name: 'Roti', category: 'Main Course', price: 20, isActive: true },
    { id: 4, name: 'Gulab Jamun', category: 'Desserts', price: 80, isActive: true },
    { id: 5, name: 'Masala Dosa', category: 'Main Course', price: 120, isActive: true },
    { id: 6, name: 'Coffee', category: 'Beverages', price: 60, isActive: true },
    { id: 7, name: 'Spring Roll', category: 'Starters', price: 150, isActive: true },
    { id: 8, name: 'Ice Cream', category: 'Desserts', price: 100, isActive: true },
  ];

  private initialTables: Table[] = [
    { id: 1, tableNumber: 'T1', capacity: 2, status: 'Available' },
    { id: 2, tableNumber: 'T2', capacity: 4, status: 'Occupied', activeOrderId: 1 },
    { id: 3, tableNumber: 'T3', capacity: 4, status: 'Available' },
    { id: 4, tableNumber: 'T4', capacity: 6, status: 'Reserved' },
    { id: 5, tableNumber: 'T5', capacity: 2, status: 'Available' },
    { id: 6, tableNumber: 'T6', capacity: 8, status: 'Available' },
  ];

  private initialOrders: Order[] = [
    {
      id: 1,
      orderNumber: 'ORD-1001',
      type: 'Dine-in',
      tableNumber: 'T2',
      items: [
        { menuItem: this.initialMenuItems[0], quantity: 2 },
        { menuItem: this.initialMenuItems[2], quantity: 4 }
      ],
      subtotal: 780,
      tax: 140.4,
      total: 920.4,
      status: 'Preparing',
      createdAt: new Date(),
      isPaid: false,
      mobile: '9876543210',
      remark: 'Extra spicy please'
    },
    {
      id: 2,
      orderNumber: 'ORD-1002',
      type: 'Room Service',
      roomNumber: '203',
      items: [
        { menuItem: this.initialMenuItems[1], quantity: 1 },
        { menuItem: this.initialMenuItems[5], quantity: 2 }
      ],
      subtotal: 400,
      tax: 72,
      total: 472,
      status: 'Ready',
      createdAt: new Date(Date.now() - 1800000),
      isPaid: false,
      mobile: '9988776655',
      remark: 'Careful with the tray'
    }
  ];

  private _menuItems = new BehaviorSubject<MenuItem[]>(this.initialMenuItems);
  private _tables = new BehaviorSubject<Table[]>(this.initialTables);
  private _orders = new BehaviorSubject<Order[]>(this.initialOrders);

  // Expose Observables
  public readonly menuItems$ = this._menuItems.asObservable();
  public readonly tables$ = this._tables.asObservable();
  public readonly orders$ = this._orders.asObservable();

  private nextOrderId = 3;
  private nextOrderNumber = 1003;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedMenuItems = localStorage.getItem(this.MENU_ITEMS_KEY);
    if (storedMenuItems) {
       this._menuItems.next(JSON.parse(storedMenuItems));
    }

    const storedTables = localStorage.getItem(this.TABLES_KEY);
    if (storedTables) {
      this._tables.next(JSON.parse(storedTables));
    }

    const storedOrders = localStorage.getItem(this.ORDERS_KEY);
    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      orders.forEach((o: any) => o.createdAt = new Date(o.createdAt));
      this._orders.next(orders);
      
      if (orders.length > 0) {
        this.nextOrderId = Math.max(...orders.map((o: any) => o.id)) + 1;
        const lastOrderNum = Math.max(...orders.map((o: any) => {
             const parts = o.orderNumber.split('-');
             return parts.length > 1 ? parseInt(parts[1]) : 1000;
        }));
        this.nextOrderNumber = lastOrderNum + 1;
      }
    }
  }

  private saveMenuItems() {
    localStorage.setItem(this.MENU_ITEMS_KEY, JSON.stringify(this.menuItems));
  }

  private saveTables() {
    localStorage.setItem(this.TABLES_KEY, JSON.stringify(this.tables));
  }

  private saveOrders() {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(this.orders));
  }

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

  // Current State Sync Getters
  get menuItems(): MenuItem[] {
    return this._menuItems.getValue();
  }

  get tables(): Table[] {
    return this._tables.getValue();
  }

  get orders(): Order[] {
    return this._orders.getValue();
  }

  // Menu Methods
  getMenuItems(): MenuItem[] {
    return [...this.menuItems];
  }

  getActiveMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => item.isActive);
  }

  getActiveMenuItems$(): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => items.filter(item => item.isActive))
    );
  }

  getMenuItemsByCategory(category: string): MenuItem[] {
    return this.menuItems.filter(item => item.category === category && item.isActive);
  }

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: Math.max(...this.menuItems.map(i => i.id), 0) + 1
    };
    this._menuItems.next([...this.menuItems, newItem]);
    this.saveMenuItems();
    return newItem;
  }

  updateMenuItem(item: MenuItem): void {
    const items = [...this.menuItems];
    const index = items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
      this._menuItems.next(items);
      this.saveMenuItems();
    }
  }

  disableMenuItem(id: number): void {
    const items = [...this.menuItems];
    const item = items.find(i => i.id === id);
    if (item) {
      item.isActive = false;
      this._menuItems.next(items);
      this.saveMenuItems();
    }
  }

  // Table Methods
  getTables(): Table[] {
    return [...this.tables];
  }

  getAvailableTables(): Table[] {
    return this.tables.filter(t => t.status === 'Available');
  }

  getAvailableTables$(): Observable<Table[]> {
    return this.tables$.pipe(
      map(tables => tables.filter(t => t.status === 'Available'))
    );
  }

  updateTableStatus(id: number, status: Table['status'], activeOrderId?: number): void {
    const tables = [...this.tables];
    const tableIndex = tables.findIndex(t => t.id === id);
    if (tableIndex !== -1) {
      tables[tableIndex] = { ...tables[tableIndex], status, activeOrderId };
      this._tables.next(tables);
      this.saveTables();
    }
  }

  // Order Methods
  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  getOrderById$(id: number): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(o => o.id === id))
    );
  }

  getPendingOrders(): Order[] {
    return this.orders.filter(o => !o.isPaid);
  }

  getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter(o => o.status === status);
  }

  getOrdersByStatus$(status: Order['status']): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => orders.filter(o => o.status === status))
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: this.nextOrderId++,
      orderNumber: `ORD-${this.nextOrderNumber++}`,
      createdAt: new Date()
    };

    // Update Orders
    this._orders.next([...this.orders, newOrder]);
    this.saveOrders();

    // Update Tables if Dine-in
    if (newOrder.type === 'Dine-in' && newOrder.tableNumber) {
      const tables = [...this.tables];
      const tableIndex = tables.findIndex(t => t.tableNumber === newOrder.tableNumber);
      if (tableIndex !== -1) {
        tables[tableIndex] = {
          ...tables[tableIndex],
          status: 'Occupied',
          activeOrderId: newOrder.id
        };
        this._tables.next(tables);
        this.saveTables();
      }
    }

    return newOrder;
  }

  updateOrderStatus(id: number, status: Order['status']): void {
    const orders = [...this.orders];
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
      orders[orderIndex] = { ...orders[orderIndex], status };
      this._orders.next(orders);
      this.saveOrders();
    }
  }

  markOrderPaid(id: number, paymentMode: string, postedToRoom?: boolean): void {
    const orders = [...this.orders];
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex !== -1) {
      const order = { ...orders[orderIndex], isPaid: true, paymentMode, postedToRoom };
      orders[orderIndex] = order;
      this._orders.next(orders);
      this.saveOrders();

      if (order.type === 'Dine-in' && order.tableNumber) {
        const tables = [...this.tables];
        const tableIndex = tables.findIndex(t => t.tableNumber === order.tableNumber);
        if (tableIndex !== -1) {
          tables[tableIndex] = { ...tables[tableIndex], status: 'Available', activeOrderId: undefined };
          this._tables.next(tables);
          this.saveTables();
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
