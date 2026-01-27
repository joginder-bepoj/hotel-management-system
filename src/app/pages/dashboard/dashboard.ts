import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';

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
    NgApexchartsModule
  ],
})
export class DashboardComponent {
  totalIncomeSeries = [
  {
    name: 'income',
    data: [31, 40, 28, 44, 60, 55, 68, 51, 42, 85, 77],
  },
];

totalIncomeChart: ApexChart = {
  type: 'bar',
  height: 25,
  width:100,
  sparkline: {
    enabled: true,
  },
  toolbar: {
    show: false,
  },
};

totalIncomePlotOptions = {
  bar: {
    columnWidth: '60%',
    borderRadius: 3,
  },
};

totalIncomeColors = ['#008FFB'];

totalIncomeTooltip = {
  enabled: true,
};
  /* ================= TABLE ================= */
  displayedColumns: string[] = ['name', 'checkIn', 'checkOut', 'status', 'phone', 'roomType'];
  dataSource = [
    {
      name: 'John Deo',
      checkIn: '12-08-2019',
      checkOut: '15-08-2019',
      status: 'Paid',
      phone: '(123)123456',
      roomType: 'Single',
    },
    {
      name: 'Jens Brincker',
      checkIn: '13-08-2019',
      checkOut: '16-08-2019',
      status: 'Unpaid',
      phone: '(123)123456',
      roomType: 'Double',
    },
  ];

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

  legend: ApexLegend = {
    position: 'top'
  };

  /* ================= ROOM BOOKING (DONUT) ================= */

  roomBookingSeries: ApexNonAxisChartSeries = [734, 567, 464, 382];

  roomBookingChart: ApexChart = {
    type: 'donut',
    height: 300
  };

  roomBookingLabels: string[] = [
    'Single',
    'Double',
    'King',
    'Apartments'
  ];

  roomBookingColors = ['#3F51B5', '#FF9800', '#E91E63', '#26C6DA'];

}
