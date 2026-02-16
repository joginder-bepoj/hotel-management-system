import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  {
    path: 'authentication/login',
    loadComponent: () =>
      import('./pages/auth/login/login').then((c) => c.LoginComponent),
  },
  {
    path: 'authentication/signup',
    loadComponent: () =>
      import('./pages/auth/signup/signup').then((c) => c.SignupComponent),
  },
  {
    path: 'authentication/forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password').then((c) => c.ForgotPasswordComponent),
  },
  {
    path: 'setup',
    loadComponent: () =>
      import('./pages/setup/setup').then((c) => c.SetupComponent),
  },
  {
    path: 'setup/hotel',
    loadComponent: () =>
      import('./pages/setup/hotel/hotel-setup').then((c) => c.HotelSetupComponent),
  },
  {
    path: 'setup/restaurant',
    loadComponent: () =>
      import('./pages/setup/restaurant/restaurant-setup').then((c) => c.RestaurantSetupComponent),
  },
  {
    path: 'setup/apartment',
    loadComponent: () =>
      import('./pages/setup/apartment/apartment-setup').then((c) => c.ApartmentSetupComponent),
  },
  { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((c) => c.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then((c) => c.ProfileComponent),
      },
      {
        path: 'booking',
        children: [
          {
            path: 'all-booking',
            loadComponent: () =>
              import('./pages/booking/all-booking/all-booking').then((c) => c.AllBooking),
          },
          {
            path: 'add-booking',
            loadComponent: () =>
              import('./pages/booking/add-booking/add-booking').then((c) => c.AddBookingComponent),
          },
          {
            path: 'online-reservation',
            loadComponent: () =>
              import('./pages/booking/online-reservation/online-reservation').then((c) => c.OnlineReservationComponent),
          },
          {
            path: 'group-booking',
            loadComponent: () =>
              import('./pages/booking/group-booking/group-booking').then((c) => c.GroupBookingComponent),
          },
          {
            path: 'booking-calendar',
            loadComponent: () =>
              import('./pages/booking/booking-calendar/booking-calendar').then((c) => c.BookingCalendarComponent),
          },
          {
            path: 'cancellation-modification',
            loadComponent: () =>
              import('./pages/booking/cancellation-modification/cancellation-modification').then((c) => c.CancellationModificationComponent),
          },
          {
            path: 'check-in-out',
            loadComponent: () =>
              import('./pages/booking/check-in-out/check-in-out').then((c) => c.CheckInOutComponent),
          },
          {
            path: 'edit-booking/:id',
            loadComponent: () =>
              import('./pages/booking/edit-booking/edit-booking').then((c) => c.EditBookingComponent),
          },
        ]
      },
      {
        path: 'rooms',
        children: [
          {
            path: 'room-availability',
            loadComponent: () =>
              import('./pages/rooms/room-availability-dashboard/room-availability-dashboard').then((c) => c.RoomAvailabilityDashboardComponent),
          },
          {
            path: 'room-types',
            loadComponent: () =>
              import('./pages/rooms/room-types-pricing/room-types-pricing').then((c) => c.RoomTypesPricingComponent),
          },
          {
            path: 'room-status',
            loadComponent: () =>
              import('./pages/rooms/room-status-monitoring/room-status-monitoring').then((c) => c.RoomStatusMonitoringComponent),
          },
          {
            path: 'floor-mapping',
            loadComponent: () =>
              import('./pages/rooms/floor-mapping/floor-mapping').then((c) => c.FloorMappingComponent),
          },
          {
            path: 'all-rooms',
            loadComponent: () =>
              import('./pages/rooms/all-rooms/all-rooms').then((c) => c.AllRooms),
          },
          {
            path: 'add-room',
            loadComponent: () =>
              import('./pages/rooms/add-room/add-room').then((c) => c.AddRoomComponent),
          },
          {
            path: 'edit-room/:id',
            loadComponent: () =>
              import('./pages/rooms/edit-room/edit-room').then((c) => c.EditRoomComponent),
          },
          {
            path: 'amenities',
            loadComponent: () =>
              import('./pages/rooms/amenities/amenities').then((c) => c.AmenitiesComponent),
          },
        ]
      },
      {
        path: 'inventory',
        children: [
          {
            path: 'stock-management',
            loadComponent: () =>
              import('./pages/inventory/stock-management/stock-management').then((c) => c.StockManagementComponent),
          },
          {
            path: 'supplier-management',
            loadComponent: () =>
              import('./pages/inventory/supplier-management/supplier-management').then((c) => c.SupplierManagementComponent),
          },
          {
            path: 'purchase-orders',
            loadComponent: () =>
              import('./pages/inventory/purchase-orders/purchase-orders').then((c) => c.PurchaseOrdersComponent),
          },
          {
            path: 'consumption-tracking',
            loadComponent: () =>
              import('./pages/inventory/consumption-tracking/consumption-tracking').then((c) => c.ConsumptionTrackingComponent),
          },
          {
            path: 'low-stock-alerts',
            loadComponent: () =>
              import('./pages/inventory/low-stock-alerts/low-stock-alerts').then((c) => c.LowStockAlertsComponent),
          },
          {
            path: 'store-warehouse',
            loadComponent: () =>
              import('./pages/inventory/store-warehouse/store-warehouse').then((c) => c.StoreWarehouseComponent),
          },
        ]
      },
      {
        path: 'front-office',
        children: [
          {
            path: 'guest-registration',
            loadComponent: () =>
              import('./pages/front-office/guest-registration/guest-registration').then((c) => c.GuestRegistrationComponent),
          },
          {
            path: 'walk-in-booking',
            loadComponent: () =>
              import('./pages/front-office/walk-in-booking/walk-in-booking').then((c) => c.WalkInBookingComponent),
          },
          {
            path: 'room-allocation',
            loadComponent: () =>
              import('./pages/front-office/room-allocation/room-allocation').then((c) => c.RoomAllocationComponent),
          },
          {
            path: 'key-management',
            loadComponent: () =>
              import('./pages/front-office/key-management/key-management').then((c) => c.KeyManagementComponent),
          },
          {
            path: 'guest-history',
            loadComponent: () =>
              import('./pages/front-office/guest-history/guest-history').then((c) => c.GuestHistoryComponent),
          },
        ]
      },
      {
        path: 'housekeeping',
        children: [
          {
            path: 'cleaning-schedule',
            loadComponent: () =>
              import('./pages/housekeeping/cleaning-schedule/cleaning-schedule').then((c) => c.CleaningScheduleComponent),
          },
          {
            path: 'room-cleaning-status',
            loadComponent: () =>
              import('./pages/housekeeping/room-cleaning-status/room-cleaning-status').then((c) => c.RoomCleaningStatusComponent),
          },
          {
            path: 'staff-assignment',
            loadComponent: () =>
              import('./pages/housekeeping/staff-assignment/staff-assignment').then((c) => c.StaffAssignmentComponent),
          },
          {
            path: 'laundry-management',
            loadComponent: () =>
              import('./pages/housekeeping/laundry-management/laundry-management').then((c) => c.LaundryManagementComponent),
          },
          {
            path: 'maintenance-requests',
            loadComponent: () =>
              import('./pages/housekeeping/maintenance-requests/maintenance-requests').then((c) => c.MaintenanceRequestsComponent),
          },
        ]
      },
      {
        path: 'billing',
        children: [
          {
            path: 'invoice-management',
            loadComponent: () =>
              import('./pages/billing/invoice-management/invoice-management').then((c) => c.InvoiceManagementComponent),
          },
          {
            path: 'payment-collection',
            loadComponent: () =>
              import('./pages/billing/payment-collection/payment-collection').then((c) => c.PaymentCollectionComponent),
          },
          {
            path: 'refund-management',
            loadComponent: () =>
              import('./pages/billing/refund-management/refund-management').then((c) => c.RefundManagementComponent),
          },
          {
            path: 'folio-management',
            loadComponent: () =>
              import('./pages/billing/folio-management/folio-management').then((c) => c.FolioManagementComponent),
          },
          {
            path: 'tax-calculation',
            loadComponent: () =>
              import('./pages/billing/tax-calculation/tax-calculation').then((c) => c.TaxCalculationComponent),
          },
        ]
      },
      {
        path: 'guest-management',
        children: [
          {
            path: 'guest-profiles',
            loadComponent: () =>
              import('./pages/guest-management/guest-profiles/guest-profiles').then((c) => c.GuestProfilesComponent),
          },
          {
            path: 'guest-preferences',
            loadComponent: () =>
              import('./pages/guest-management/guest-preferences/guest-preferences').then((c) => c.GuestPreferencesComponent),
          },
          {
            path: 'loyalty-programs',
            loadComponent: () =>
              import('./pages/guest-management/loyalty-programs/loyalty-programs').then((c) => c.LoyaltyProgramsComponent),
          },
          {
            path: 'feedback-reviews',
            loadComponent: () =>
              import('./pages/guest-management/feedback-reviews/feedback-reviews').then((c) => c.FeedbackReviewsComponent),
          },
        ]
      },
      {
        path: 'restaurant',
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/restaurant/dashboard/dashboard').then((c) => c.RestaurantDashboardComponent),
          },
          {
            path: 'new-order',
            loadComponent: () =>
              import('./pages/restaurant/new-order/new-order').then((c) => c.NewOrderComponent),
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./pages/restaurant/orders/orders').then((c) => c.OrdersComponent),
          },
          {
            path: 'tables',
            loadComponent: () =>
              import('./pages/restaurant/tables/tables').then((c) => c.TablesComponent),
          },
          {
            path: 'menu',
            loadComponent: () =>
              import('./pages/restaurant/menu/menu').then((c) => c.MenuComponent),
          },
          {
            path: 'kitchen',
            loadComponent: () =>
              import('./pages/restaurant/kitchen/kitchen').then((c) => c.KitchenComponent),
          },
          {
            path: 'bills',
            loadComponent: () =>
              import('./pages/restaurant/bills/bills').then((c) => c.BillsComponent),
          },
        ]
      },
      {
        path: 'daily-diary',
        loadComponent: () =>
          import('./pages/daily-diary/daily-diary').then((c) => c.DailyDiaryComponent),
      },
    ],
  },
];
