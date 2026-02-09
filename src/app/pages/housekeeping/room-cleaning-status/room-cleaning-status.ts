import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { NgApexchartsModule, ChartComponent, ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexDataLabels, ApexLegend, ApexStroke, ApexTooltip } from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: 'app-room-cleaning-status',
    templateUrl: './room-cleaning-status.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        NgApexchartsModule,
        MatCardModule
    ]
})
export class RoomCleaningStatusComponent {
    @ViewChild('chart') chart!: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        this.chartOptions = {
            series: [45, 15, 30, 10], // Mock Data
            chart: {
                type: 'donut',
                height: 350
            },
            labels: ['Clean', 'Dirty', 'Occupied', 'Maintenance'],
            colors: ['#4CAF50', '#9E9E9E', '#F44336', '#FF9800'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ],
            dataLabels: {
                enabled: true
            },
            legend: {
                position: 'bottom'
            }
        };
    }
}
