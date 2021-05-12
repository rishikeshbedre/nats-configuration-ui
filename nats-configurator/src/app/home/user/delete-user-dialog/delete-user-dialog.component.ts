import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestApiService } from '../../../services/rest-api.service';
import { HomeComponent } from '../../home.component';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteUserDialogComponent>,
              private restclient: RestApiService,
              private hc: HomeComponent,
              private spinnerservice: SpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  deleteuser() {
    this.dialogRef.close('deleting');
    for (let i = 0; i < this.data.length; i++) {
      let temp = {
        user: this.data[i].user
      };
      this.restclient.deleteUser(temp).subscribe(
        resp => {
          setTimeout(() => {
            this.spinnerservice.stopSpinner();
            this.hc.snackbarSucces(JSON.stringify(resp.message));
          }, 500);
        },
        error => {
          setTimeout(() => {
            this.spinnerservice.stopSpinner();
            this.hc.snackbarError(JSON.stringify(error.error));
          }, 500);
        }
      );
    }
  }

}
