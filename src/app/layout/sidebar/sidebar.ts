import { Component, Input, EventEmitter, Output } from '@angular/core';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    materialImports,
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

  @Input() sidebarOpen = false;
  @Output() menuSelected = new EventEmitter<void>();
  closeSidebar() {
    this.menuSelected.emit();
  }
  

}