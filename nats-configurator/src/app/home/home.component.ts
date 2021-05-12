import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private configSucces: MatSnackBarConfig = {
    panelClass: ['style-success'],
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['style-error'],
    duration: 10000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
  };

  constructor(private snackbar: MatSnackBar, public spinnerservice: SpinnerService) { }

  ngOnInit(): void { }

  public snackbarSucces(message) {
    this.snackbar.open(message, 'Close', this.configSucces);
  }

  public snackbarError(message) {
    this.snackbar.open(message, 'Close', this.configError);
  }
}
