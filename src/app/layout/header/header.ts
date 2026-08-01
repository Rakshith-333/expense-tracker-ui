import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { TranslationService } from '../../core/services/translation.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    materialImports,
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {


  private readonly tokenService = inject(TokenService);
  private readonly translationService = inject(TranslationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  pageTitle = 'dashboard';

  @Output()
  menuClicked = new EventEmitter<void>();


  userName =
    this.tokenService.getUser<{ name:string }>()?.name ?? 'User';

  get t() {
    return this.translationService;
  }


  greeting = '';



  ngOnInit(){

    this.setGreeting();
    this.dynamicHeaderName();
    this.translationService.language$.subscribe(() => {
      this.setGreeting();
      this.cdr.detectChanges();
    });

  }
dynamicHeaderName() {

  const updateTitle = () => {
    let currentRoute = this.activatedRoute.root;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    this.pageTitle = currentRoute.snapshot.data['title'] ?? 'dashboard';
    this.cdr.detectChanges();

    console.log(
      'Current URL:',
      this.router.url,
      'Title:',
      this.pageTitle
    );
  };

  updateTitle();

  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => updateTitle());
}



  openMenu(){

    this.menuClicked.emit();

  }



  private setGreeting(){

    const indiaTime =
      new Date().toLocaleString(
        'en-US',
        {
          timeZone:'Asia/Kolkata'
        }
      );

    const hour =
      new Date(indiaTime).getHours();

    if (hour < 12) {
      this.greeting = this.translationService.translate('goodMorning');
    } else if (hour < 17) {
      this.greeting = this.translationService.translate('goodAfternoon');
    } else if (hour < 20) {
      this.greeting = this.translationService.translate('goodEvening');
    } else {
      this.greeting = this.translationService.translate('goodNight');
    }

  }


}