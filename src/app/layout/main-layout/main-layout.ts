import { Component } from '@angular/core';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';

@Component({
  selector: 'app-main-layout',
  imports:[
    materialImports,
    CommonModule,
    RouterModule,
    Sidebar,
    Header
  ],
  templateUrl:'./main-layout.html',
  styleUrl:'./main-layout.scss'
})
export class MainLayout {


sidebarOpen=false;



toggleSidebar(){

this.sidebarOpen=!this.sidebarOpen;
console.log('Sidebar:', this.sidebarOpen);

}

closeSidebar() {
  if (window.innerWidth < 992) {
    this.sidebarOpen = false;
  }
}


}