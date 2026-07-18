import { Component, inject } from '@angular/core';
import { materialImports } from '../../../material';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-expense-success-dialog',
  imports: [materialImports],
  templateUrl: './add-expense-success-dialog.html',
  styleUrl: './add-expense-success-dialog.scss',
})
export class AddExpenseSuccessDialog {
     private dialogRef = inject(MatDialogRef<AddExpenseSuccessDialog>);

     yes() {
      this.dialogRef.close(true);
    }

    no() {
      this.dialogRef.close(false);
    }
}
