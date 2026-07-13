import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

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


  @Output()
  menuClicked = new EventEmitter<void>();


  userName =
    this.tokenService.getUser<{ name:string }>()?.name ?? 'User';


  greeting = '';



  ngOnInit(){

    this.setGreeting();

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



    if(hour < 12){

      this.greeting='Good Morning';

    }
    else if(hour < 17){

      this.greeting='Good Afternoon';

    }
    else{

      this.greeting='Good Evening';

    }

  }


}