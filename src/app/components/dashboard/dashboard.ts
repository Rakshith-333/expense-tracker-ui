import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartOptions } from 'chart.js'; 



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
recentExpenses = [
  {
    category: 'Food',
    description: 'Lunch',
    amount: 350,
    date: 'Today',
    icon: 'restaurant',
    color: '#7C3AED'
  },
  {
    category: 'Transport',
    description: 'Fuel',
    amount: 1200,
    date: 'Yesterday',
    icon: 'directions_car',
    color: '#3B82F6'
  },
  {
    category: 'Shopping',
    description: 'Clothes',
    amount: 850,
    date: '02 Jul',
    icon: 'shopping_bag',
    color: '#F97316'
  },
  {
    category: 'Health',
    description: 'Medicine',
    amount: 450,
    date: '01 Jul',
    icon: 'medical_services',
    color: '#22C55E'
  }
];

topCategories = [
  {
    id: 1,
    name: 'Food',
    amount: 8450,
    percentage: 48,
    color: '#7C4DFF'
  },
  {
    id: 2,
    name: 'Shopping',
    amount: 5300,
    percentage: 30,
    color: '#2196F3'
  },
  {
    id: 3,
    name: 'Transport',
    amount: 2100,
    percentage: 12,
    color: '#FF9800'
  },
  {
    id: 4,
    name: 'Health',
    amount: 1500,
    percentage: 10,
    color: '#4CAF50'
  }
];





selectedPeriod = 'month';
selectedTrend = 'month';

lineChartData: ChartConfiguration<'line'>['data'] = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Expenses',
      data: [3500, 5200, 4100, 6800],
      borderColor: '#7C3AED',
      backgroundColor: 'rgba(124,58,237,.15)',
      fill: true,
      tension: 0.4
    }
  ]
};

lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
};


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
