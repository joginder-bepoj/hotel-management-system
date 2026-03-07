import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexPlotOptions,
  ApexYAxis,
  ApexTheme,
  ApexFill,
  ApexLegend,
  ApexTitleSubtitle,
  ApexGrid,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexResponsive
} from 'ng-apexcharts';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, Order } from '../../../core/services/restaurant.service';
import { Subscription } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  theme: ApexTheme;
  markers: ApexMarkers;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  colors: string[];
};

@Component({
  selector: 'app-restaurant-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    RouterModule,
    NgApexchartsModule,
    BreadcrumbComponent
  ]
})
export class RestaurantDashboardComponent implements OnInit, OnDestroy {
  // Statistics
  todaysSales: number = 0;
  totalOrders: number = 0;
  roomServiceOrders: number = 0;
  dineInOrders: number = 0;
  pendingOrdersCount: number = 0;

  // Data Lists
  pendingOrdersList: Order[] = [];
  displayedColumns: string[] = ['orderNo', 'type', 'location', 'items', 'time'];

  // Charts
  public salesChartOptions!: Partial<ChartOptions>;
  public splitChartOptions!: Partial<PieChartOptions>;

  private subscriptions = new Subscription();
  private chartsInitialized = false;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initChartConfigs();

    this.subscriptions.add(
      this.restaurantService.orders$.subscribe(orders => {
        this.calculateStatistics(orders);
        this.updateCharts();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  calculateStatistics(orders: Order[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Daily Stats
    this.todaysSales = orders
      .filter(o => o.createdAt >= today && o.isPaid)
      .reduce((sum, o) => sum + o.total, 0);

    this.totalOrders = orders.filter(o => o.createdAt >= today).length;
    this.roomServiceOrders = orders.filter(o => o.createdAt >= today && o.type === 'Room Service').length;
    this.dineInOrders = orders.filter(o => o.createdAt >= today && o.type === 'Dine-in').length;

    // Pending kitchen
    this.pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

    // Pending List for Table
    this.pendingOrdersList = orders
      .filter(o => o.status === 'Pending')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, 5); // Limit to 5
  }

  initChartConfigs() {
    // Basic setup without data arrays
    this.salesChartOptions = {
      series: [{
        name: 'Sales Today',
        data: []
      }],
      chart: {
        height: 280,
        type: 'area',
        toolbar: { show: false },
        fontFamily: 'Poppins, sans-serif'
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
        labels: { style: { colors: '#9aa0ac' } }
      },
      yaxis: {
        labels: { style: { colors: '#9aa0ac' }, formatter: (value) => { return '₹' + value } }
      },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }
      },
      markers: { size: 4 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      theme: { mode: 'light', palette: 'palette1' }
    };

    this.splitChartOptions = {
      series: [],
      chart: {
        width: 300,
        type: 'donut',
        fontFamily: 'Poppins, sans-serif'
      },
      labels: ['Room Service', 'Dine-In'],
      colors: ['#3F51B5', '#FF9800'],
      legend: { show: true, position: 'bottom' },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return Math.round(val) + "%";
        }
      },
      plotOptions: { pie: { donut: { size: '65%' } } },
      responsive: [{
        breakpoint: 480,
        options: { chart: { width: 200 }, legend: { position: 'bottom' } }
      }]
    };

    this.chartsInitialized = true;
  }

  updateCharts() {
    if (!this.chartsInitialized) return;

    // Simulate some sales trend data that matches the daily total (for mock purposes)
    // Real implementation would group orders by hour.
    const base = this.todaysSales / 7;
    const trendData = [
      Math.round(base * 0.4),
      Math.round(base * 0.8),
      Math.round(base * 1.5),
      Math.round(base * 1.8),
      Math.round(base * 1.0),
      Math.round(base * 1.2),
      Math.round(base * 0.3)
    ];

    this.salesChartOptions.series = [{
      name: 'Sales Trend',
      data: trendData
    }];

    // Avoid blank pie chart if 0 orders
    const rs = this.roomServiceOrders > 0 ? this.roomServiceOrders : 1;
    const di = this.dineInOrders > 0 ? this.dineInOrders : 1;

    this.splitChartOptions.series = [rs, di];
  }

  navigateToNewOrder() {
    this.router.navigate(['/restaurant/new-order']);
  }

  navigateToKitchen() {
    this.router.navigate(['/restaurant/kitchen']);
  }

  navigateToTables() {
    this.router.navigate(['/restaurant/tables']);
  }
}
