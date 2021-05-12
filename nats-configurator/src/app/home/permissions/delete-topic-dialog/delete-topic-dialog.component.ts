import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestApiService } from '../../../services/rest-api.service';
import { HomeComponent } from '../../home.component';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-delete-topic-dialog',
  templateUrl: './delete-topic-dialog.component.html',
  styleUrls: ['./delete-topic-dialog.component.css']
})
export class DeleteTopicDialogComponent implements OnInit {

  public publishArray = [];
  public subscribeArray = [];
  constructor(private dialogRef: MatDialogRef<DeleteTopicDialogComponent>,
              private restclient: RestApiService,
              private hc: HomeComponent,
              private spinnerservice: SpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data.publishtopics.length > 0) {
      this.data.user = this.data.publishtopics[0].user;
    } else {
      this.data.user = this.data.subscribetopics[0].user;
    }

    this.data.publishtopics.forEach(element => {
      this.publishArray.push(element.publish);
    });

    this.data.subscribetopics.forEach(element => {
      this.subscribeArray.push(element.subscribe);
    });
  }

  deleteTopic() {
    let temp = {
      user: this.data.user,
      permissions: {
        publish: this.publishArray,
        subscribe: this.subscribeArray
      }
    };
    this.dialogRef.close('deleting');
    this.restclient.deleteTopic(temp).subscribe(
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
