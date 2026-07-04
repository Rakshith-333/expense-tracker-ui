import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private tokenService = inject(TokenService);
  private router = inject(Router)
  ngOnInit(): void {}

  logout(){
    this.tokenService.logout();
    this.router.navigate(['/login'])
  }

}
