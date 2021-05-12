import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RestApiService } from '../../../services/rest-api.service';
import { HomeComponent } from '../../home.component';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  public addUserForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>,
              private fb: FormBuilder,
              private restclient: RestApiService,
              private hc: HomeComponent,
              private spinnerservice: SpinnerService) { }

  ngOnInit() {
    this.addUserForm = this.fb.group({
      user: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get user() {
    return this.addUserForm.get('user');
  }
  get password() {
    return this.addUserForm.get('password');
  }

  onSubmit() {
    this.dialogRef.close('adding');
    this.restclient.addUser(this.addUserForm.value).subscribe(
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
