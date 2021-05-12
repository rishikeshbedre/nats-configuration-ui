import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { RestApiService } from 'src/app/services/rest-api.service';
import { HomeComponent } from '../home.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
import { DeleteTopicDialogComponent } from './delete-topic-dialog/delete-topic-dialog.component';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {

  displayedColumns: string[] = ['selectPublish', 'publish', 'selectSubscribe', 'subscribe'];
  public dataSource = new MatTableDataSource();
  public UserData;
  selectionPublish = new SelectionModel<any>(true, []);
  selectionSubscribe = new SelectionModel<any>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dataservice: DataService,
              private restclient: RestApiService,
              private hc: HomeComponent,
              private dialog: MatDialog,
              private spinnerservice: SpinnerService) { }

  ngOnInit(): void {
    this.dataservice.currentUser.subscribe(
      message => {
        this.UserData = message;
        if (this.UserData.length === 0) {
          this.UserData.push({ publish: 'No user is selected', subscribe: 'No user is selected', user: null });
        }
        if (this.UserData.length < 10) {
          for (let i = this.UserData.length; i < 10; i++) {
            this.UserData.push({ publish: null, subscribe: null, user: null });
          }
        }
        this.dataSource = new MatTableDataSource(this.UserData);
        this.dataSource.sort = this.sort;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // ------------------------------------------publish-topic----------------------------------------------
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedPublish() {
    const numSelected = this.selectionPublish.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterTogglePublish() {
    this.isAllSelectedPublish() ?
      this.selectionPublish.clear() :
      this.dataSource.data.forEach(row => this.selectionPublish.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelPublish(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedPublish() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionPublish.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selectionTogglePublish(data) {
    this.selectionPublish.toggle(data);
    // console.log(this.selectionPublish.selected);
  }

  // ------------------------------------subscribe-topic-----------------------------------------------
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedSubscribe() {
    const numSelected = this.selectionSubscribe.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSubscribe() {
    this.isAllSelectedSubscribe() ?
      this.selectionSubscribe.clear() :
      this.dataSource.data.forEach(row => this.selectionSubscribe.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelSubscribe(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedSubscribe() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionSubscribe.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selectionToggleSubscribe(data) {
    this.selectionSubscribe.toggle(data);
    // console.log(this.selectionSubscribe.selected);
  }

  openAddTopicDialog() {
    let publishCheck = this.dataservice.checkPublishorSubscribeUser(this.UserData, 'publish');
    let subscribeCheck = this.dataservice.checkPublishorSubscribeUser(this.UserData, 'subscribe');
    if (publishCheck === true && subscribeCheck === true) {
      const addTopicdialogRef = this.dialog.open(AddTopicDialogComponent, {
        width: '45vw',
        height: '70vh',
        data: this.UserData
      });

      addTopicdialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinnerservice.loadSpinner();
        }
      });

    } else if (publishCheck !== true) {
      this.hc.snackbarError(publishCheck);
    } else {
      this.hc.snackbarError(subscribeCheck);
    }
  }

  deleteTopicVerified() {
    const deleteTopicdialogRef = this.dialog.open(DeleteTopicDialogComponent, {
      width: '45vw',
      height: '60vh',
      data: {
        publishtopics: this.selectionPublish.selected,
        subscribetopics: this.selectionSubscribe.selected
      }
    });

    deleteTopicdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerservice.loadSpinner();
      }
    });
  }

  openDeleteTopicDialog() {
    let publishCheck = this.dataservice.checkPublishorSubscribeSelected(this.selectionPublish.selected, 'publish');
    let subscribeCheck = this.dataservice.checkPublishorSubscribeSelected(this.selectionSubscribe.selected, 'subscribe');
    if (publishCheck === true && subscribeCheck === true) {
      this.deleteTopicVerified();
    } else if (publishCheck === true && this.selectionSubscribe.selected.length === 0) {
      this.deleteTopicVerified();
    } else if (subscribeCheck === true && this.selectionPublish.selected.length === 0) {
      this.deleteTopicVerified();
    } else if (publishCheck !== true) {
      this.hc.snackbarError(publishCheck);
    } else {
      this.hc.snackbarError(subscribeCheck);
    }
  }

  downloadConfiguration() {
    this.spinnerservice.loadSpinner();
    this.restclient.downloadConfiguration().subscribe(
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
