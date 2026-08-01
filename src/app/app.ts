import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('expense-tracker-ui');
  private readonly tokenService = inject(TokenService);

  ngOnInit(): void {
    this.applyTheme(this.tokenService.getTheme());
    this.applyLanguage(this.tokenService.getLanguage());
  }

  private applyTheme(theme: string): void {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');
    document.body.classList.add(`theme-${theme}`);
  }

  private applyLanguage(language: string): void {
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.setAttribute('data-language', language);
  }
}
