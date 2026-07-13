import { Component } from '@angular/core';
import { materialImports } from '../../material';

@Component({
  selector: 'app-expenses',
  imports: [materialImports],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses {}
