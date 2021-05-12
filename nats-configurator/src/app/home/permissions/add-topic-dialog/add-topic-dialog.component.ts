import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestApiService } from '../../../services/rest-api.service';
import { HomeComponent } from '../../home.component';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-add-topic-dialog',
  templateUrl: './add-topic-dialog.component.html',
  styleUrls: ['./add-topic-dialog.component.css']
})
export class AddTopicDialogComponent implements OnInit {

  public addTopicForm: FormGroup;
  topics: string[];
  filteredPublishTopics: Observable<string[]>;
  filteredSubscribeTopics: Observable<string[]>;
  publishArray = [];
  subscribeArray = [];

  constructor(private dialogRef: MatDialogRef<AddTopicDialogComponent>,
              private restclient: RestApiService,
              private hc: HomeComponent,
              private fb: FormBuilder,
              private spinnerservice: SpinnerService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.suggestionTopicInit();

    this.addTopicForm = this.fb.group({
      publishTopic: [''],
      subscribeTopic: ['']
    });
  }

  suggestionTopicInit() {
    this.restclient.getTopics().subscribe(
      resp => {
        this.topics = Object.keys(resp.message);
        this.filteredPublishTopics = this.publishTopic.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
        this.filteredSubscribeTopics = this.subscribeTopic.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
      },
      error => {
        this.hc.snackbarError(JSON.stringify(error.error));
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.topics.filter(topic => topic.toLowerCase().includes(filterValue));
  }

  get publishTopic() {
    return this.addTopicForm.get('publishTopic');
  }

  get subscribeTopic() {
    return this.addTopicForm.get('subscribeTopic');
  }

  addpublishTopic() {
    if (this.addTopicForm.value.publishTopic !== '') {
      this.publishArray.push(this.addTopicForm.value.publishTopic);
      this.addTopicForm.patchValue({publishTopic: ''});
    } else {
      this.hc.snackbarError('Cannot add empty topic');
    }
  }

  addsubscribeTopic() {
    if (this.addTopicForm.value.subscribeTopic !== '') {
      this.subscribeArray.push(this.addTopicForm.value.subscribeTopic);
      this.addTopicForm.patchValue({subscribeTopic: ''});
    } else {
      this.hc.snackbarError('Cannot add empty topic');
    }
  }

  addtopic() {
    if (this.publishArray.length > 0 || this.subscribeArray.length > 0) {
      let temp = {
        user: this.data[0].user,
        permissions: {
          publish: this.publishArray,
          subscribe: this.subscribeArray
        }
      };
      this.dialogRef.close('adding');
      this.restclient.addTopic(temp).subscribe(
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
    } else {
      this.hc.snackbarError('Please add a topic');
    }
  }
}
