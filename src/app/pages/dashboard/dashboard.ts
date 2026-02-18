import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HotelService } from '../../core/services/hotel.service';
import { BookingService, Booking } from '../../core/service/booking.service';
import { Subscription } from 'rxjs';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexPlotOptions,
  ApexDataLabels,
  ApexTooltip,
  ApexGrid
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: any; // ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatListModule,
    MatChipsModule,
    NgApexchartsModule
  ],
})
export class DashboardComponent implements OnInit {
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);
  private subscription = new Subscription();
  
  activeHotel: any;

  checkInsToday: number = 0;
  checkOutsToday: number = 0;
  currentOccupancy: number = 0; 
  totalRevenueToday: number = 0;
  pendingPayments: number = 0;
  
  totalRooms: number = 0;
  availableRooms: number = 0;
  occupiedRooms: number = 0;

  housekeepingStatus = [
    { room: '101', status: 'Cleaning', staff: 'Sarah' },
    { room: '204', status: 'Inspection', staff: 'Mike' },
    { room: '305', status: 'Dirty', staff: 'Pending' },
    { room: '102', status: 'Clean', staff: 'Sarah' },
  ];

  alerts = [
    { type: 'warning', message: 'Room 205 AC Maintenance due', time: '10 mins ago' },
    { type: 'info', message: 'VIP Guest checking in at 2 PM', time: '1 hour ago' },
    { type: 'error', message: 'Payment failed for Booking #1234', time: '2 hours ago' },
  ];

  /* ================== CHARTS ================== */
  
  // 1. Occupancy Chart (Radial Bar)
  occupancyChartOptions: any = {};

  // 2. Revenue Chart (Area)
  revenueChartOptions: any = {};

  constructor() {
    // Occupancy Chart
    this.occupancyChartOptions = {
      series: [75],
      chart: {
        height: 250,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: '#888',
              fontSize: '17px',
            },
            value: {
              formatter: function (val: number) {
                return parseInt(val.toString(), 10).toString();
              },
              color: '#111',
              fontSize: '36px',
              show: true,
            },
          }
        },
      },
      labels: ['Occupancy'],
      colors: ['#673AB7']
    };

    // Revenue Chart
    this.revenueChartOptions = {
      series: [
        {
          name: 'Revenue',
          data: [3100, 4000, 2800, 5100, 4200, 10900, 10000]
        }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z'
        ]
      },
      tooltip: {
        x: { format: 'dd/MM/yy HH:mm' }
      },
      colors: ['#4CAF50']
    };
  }

  // Room Availability Snapshot (Dynamic)
  roomAvailability: any[] = [];

  ngOnInit() {
    this.activeHotel = this.hotelService.getActiveHotel();
    this.loadRoomAvailability();

    // Subscribe to dynamic booking data
    this.subscription.add(
      this.bookingService.bookings$.subscribe(bookings => {
        this.updateDashboardMetrics(bookings);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateDashboardMetrics(bookings: Booking[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Check-ins Today
    this.checkInsToday = bookings.filter(b => {
      const arrive = new Date(b.arriveDate);
      arrive.setHours(0, 0, 0, 0);
      return arrive.getTime() === today.getTime();
    }).length;

    // 2. Check-outs Today
    this.checkOutsToday = bookings.filter(b => {
      const depart = new Date(b.departDate);
      depart.setHours(0, 0, 0, 0);
      return depart.getTime() === today.getTime();
    }).length;

    // 3. Current Occupancy (Bookings active today)
    const activeBookings = bookings.filter(b => {
      const arrive = new Date(b.arriveDate);
      const depart = new Date(b.departDate);
      arrive.setHours(0, 0, 0, 0);
      depart.setHours(23, 59, 59, 999);
      return today >= arrive && today <= depart;
    });
    this.occupiedRooms = activeBookings.length;
    if (this.totalRooms > 0) {
      this.currentOccupancy = Math.round((this.occupiedRooms / this.totalRooms) * 100);
    } else {
      this.currentOccupancy = 0;
    }
    this.availableRooms = Math.max(0, this.totalRooms - this.occupiedRooms);

    // 4. Revenue Today (Sum of advance/rent for today's check-ins or revenue assigned to today)
    this.totalRevenueToday = activeBookings.reduce((sum, b) => sum + (b.ratePerDay || 1500), 0);

    // 5. Pending Payments
    this.pendingPayments = bookings
      .filter(b => b.payment !== 'Paid')
      .reduce((sum, b) => sum + (b.balance || (b.totalRent ? b.totalRent - (b.advance || 0) : 1000)), 0);

    // 6. Update Recent Bookings Table
    this.dataSource = bookings.slice(-6).reverse().map(b => ({
      name: `${b.first} ${b.last}`,
      checkIn: new Date(b.arriveDate).toLocaleDateString(),
      checkOut: new Date(b.departDate).toLocaleDateString(),
      status: b.payment || 'Unpaid',
      phone: b.mobile,
      roomType: b.roomType
    }));

    // 7. Update Charts
    this.updateCharts(bookings);
  }

  updateCharts(bookings: Booking[]) {
    // Occupancy Chart
    this.occupancyChartOptions.series = [this.currentOccupancy];

    // Revenue Chart (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const revenueData = last7Days.map(date => {
      return bookings
        .filter(b => {
           const arrive = new Date(b.arriveDate);
           arrive.setHours(0, 0, 0, 0);
           return arrive.getTime() <= date.getTime() && new Date(b.departDate).getTime() >= date.getTime();
        })
        .reduce((sum, b) => sum + (b.ratePerDay || 1500), 0);
    });

    this.revenueChartOptions.series = [{
      name: 'Revenue',
      data: revenueData
    }];
    this.revenueChartOptions.xaxis.categories = last7Days.map(d => d.toISOString());
  }

  loadRoomAvailability() {
    if (this.activeHotel && this.activeHotel.room_types) {
      this.roomAvailability = this.activeHotel.room_types.map((type: string, index: number) => {
        // Mock some occupancy percentages based on room types
        const mockPercentages = [80, 45, 20, 65, 30, 50];
        const value = mockPercentages[index % mockPercentages.length];
        
        // Define colors for variety
        const colors = ['primary', 'accent', 'warn', 'bg-purple', 'bg-cyan', 'bg-orange'];
        const colorClass = colors[index % colors.length];

        return {
          type: type,
          percentage: value,
          color: colorClass
        };
      });
      
      // Update global summary based on setup if available
      if (this.activeHotel.total_rooms) {
        const floors = Number(this.activeHotel.total_floor || 1);
        const roomsPerFloor = Number(this.activeHotel.total_rooms || 0);
        this.totalRooms = floors * roomsPerFloor;
        
        this.occupiedRooms = Math.round((this.totalRooms * 75) / 100); // 75% default
        this.availableRooms = this.totalRooms - this.occupiedRooms;
      }
    } else {
      // Fallback/Default static data if no setup found
      this.roomAvailability = [
        { type: 'Single Rooms', percentage: 80, color: 'primary' },
        { type: 'Double Rooms', percentage: 45, color: 'accent' },
        { type: 'Suites', percentage: 20, color: 'warn' },
        { type: 'Deluxe', percentage: 65, color: 'bg-purple' }
      ];
    }
  }

  // Placeholder data - now handled by updateDashboardMetrics
  dataSource: any[] = [];
  /* ================= MISSING CHART OPTIONS RESTORED ================= */
  
  totalIncomeSeries = [
    {
      name: 'income',
      data: [31, 40, 28, 44, 60, 55, 68, 51, 42, 85, 77],
    },
  ];

  totalIncomeChart: ApexChart = {
    type: 'bar',
    height: 50,
    width: 100,
    sparkline: {
      enabled: true,
    },
    toolbar: {
      show: false,
    },
  };

  totalIncomePlotOptions: ApexPlotOptions = {
    bar: {
      columnWidth: '60%',
      borderRadius: 3,
    },
  };

  totalIncomeColors = ['#008FFB'];

  totalIncomeTooltip: ApexTooltip = {
    enabled: true,
  };

  legend: ApexLegend = {
    position: 'top'
  };

  /* ================= HOTEL SURVEY (AREA) ================= */

  hotelSurveySeries: ApexAxisChartSeries = [
    {
      name: 'New Customers',
      data: [48, 45, 43, 42, 50, 62, 75, 85, 83]
    },
    {
      name: 'Old Customers',
      data: [33, 34, 35, 36, 40, 45, 50, 52, 49]
    }
  ];

  hotelSurveyChart: ApexChart = {
    type: 'area',
    height: 300,
    toolbar: { show: false }
  };

  hotelSurveyXAxis: ApexXAxis = {
    categories: [
      '03:55', '04:05', '04:15', '04:25',
      '04:35', '04:45', '04:55', '05:25', '05:45'
    ]
  };

  hotelSurveyStroke: ApexStroke = {
    curve: 'smooth',
    width: 3
  };

  hotelSurveyFill: ApexFill = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.6,
      opacityFrom: 0.4,
      opacityTo: 0.1
    }
  };

  hotelSurveyColors = ['#9C8CF8', '#F4A641'];

  /* ================= ROOM BOOKING (DONUT) ================= */

  roomBookingSeries: ApexNonAxisChartSeries = [734, 567, 464, 382];

  roomBookingChart: ApexChart = {
    type: 'donut',
    height: 270
  };

  roomBookingLabels: string[] = [
    'Single',
    'Double',
    'King',
    'Apartments'
  ];

  roomBookingColors = ['#3F51B5', '#FF9800', '#E91E63', '#26C6DA'];
}
