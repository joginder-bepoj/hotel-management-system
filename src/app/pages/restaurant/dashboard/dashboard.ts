import { Component, OnInit, ViewChild } from '@angular/core';
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
export class RestaurantDashboardComponent implements OnInit {
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

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStatistics();
    this.initCharts();
  }

  loadStatistics() {
    this.todaysSales = this.restaurantService.getTodaysSales();
    this.totalOrders = this.restaurantService.getTodaysOrderCount();
    this.roomServiceOrders = this.restaurantService.getRoomServiceCount();
    this.dineInOrders = this.restaurantService.getDineInCount();
    this.pendingOrdersCount = this.restaurantService.getPendingKitchenOrders();
    
    // Get Pending Orders for table
    this.pendingOrdersList = this.restaurantService.getOrdersByStatus('Pending').slice(0, 5); // Limit to 5
  }

  initCharts() {
    // Sales Chart (Bar + Line combo style)
    this.salesChartOptions = {
      series: [{
        name: 'Sales Today',
        data: [1500, 2300, 3200, 4500, 3800, 5100, 6200]
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
      theme: {
        mode: 'light',
        palette: 'palette1',
      }
    };

    // Split Chart (Donut)
    this.splitChartOptions = {
        series: [this.roomServiceOrders || 4, this.dineInOrders || 6], // Fallback data
        chart: {
          width: 300,
          type: 'donut',
          fontFamily: 'Poppins, sans-serif'
        },
        labels: ['Room Service', 'Dine-In'],
        colors: ['#3F51B5', '#FF9800'],
        legend: {
            show: true,
            position: 'bottom'
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return Math.round(val) + "%"
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                }
            }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }]
    };
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
