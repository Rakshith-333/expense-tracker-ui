import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { materialImports } from '../../material';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, materialImports],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly translationService = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);

  get t() {
    return this.translationService;
  }

  ngOnInit(): void {
    this.translationService.language$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  downloadReport(format: 'csv' | 'pdf' | 'json') {
    this.authService.exportReport(format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `expense-report.${format}`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Unable to download report. Please try again.');
      },
    });
  }
}
