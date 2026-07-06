import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';



@Component({
  selector: 'app-dashboard',
  imports: [materialImports,CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private tokenService = inject(TokenService);
  private router = inject(Router)

  sidebarOpen = false;
  userName = 'Manu';
  summaryCards = [
  {
    title: 'Total This Month',
    amount: '₹15,450',
    subtitle: '+12% from last month',
    icon: 'account_balance_wallet',
    iconClass: 'purple-icon',
    cardClass: 'purple-card'
  },
  {
    title: "Today's Expense",
    amount: '₹350',
    subtitle: '3 Expenses',
    icon: 'trending_up',
    iconClass: 'green-icon',
    cardClass: 'green-card'
  },
  {
    title: 'This Week',
    amount: '₹2,450',
    subtitle: '+8% from last week',
    icon: 'calendar_month',
    iconClass: 'blue-icon',
    cardClass: 'blue-card'
  },
  {
    title: 'This Month Budget',
    amount: '₹20,000',
    subtitle: '77% Used',
    icon: 'pie_chart',
    iconClass: 'orange-icon',
    cardClass: 'orange-card'
  }
];
selectedPeriod = 'month';

pieChartType: ChartType = 'doughnut';



  ngOnInit(): void {}

  logout(){
    this.tokenService.logout();
    this.router.navigate(['/login'])
  }

 

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  
pieChartData: ChartConfiguration<'doughnut'>['data'] = {
  labels: ['Food', 'Transport', 'Shopping', 'Health'],
  datasets: [
    {
      data: [8450, 2100, 5300, 1500],

      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0'
      ],

      borderWidth: 0
    }
  ]
};

}
