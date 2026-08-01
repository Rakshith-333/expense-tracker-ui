import { ChangeDetectorRef, Component, Input, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';

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
export class Sidebar implements OnInit {
  readonly translationService = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() sidebarOpen = false;
  @Output() menuSelected = new EventEmitter<void>();

  ngOnInit(): void {
    this.translationService.language$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  closeSidebar() {
    this.menuSelected.emit();
  }

  get t() {
    return this.translationService;
  }

}