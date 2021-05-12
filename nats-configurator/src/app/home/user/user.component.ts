import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DataService } from '../../services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { HomeComponent } from '../home.component';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public users = new MatTableDataSource();
  displayedColumns: string[] = ['select', 'user'];
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private restclient: RestApiService,
              private dataservice: DataService,
              private dialog: MatDialog,
              private hc: HomeComponent,
              private spinnerservice: SpinnerService) { }

  ngOnInit(): void {
    this.showUser();
    this.dataservice.changeSelectedUser([]);
  }

  showUser() {
    this.restclient.getUser().subscribe(
      resp => {
        const tempusers = this.dataservice.checkInitialUserData(resp.message);
        this.users = new MatTableDataSource(tempusers);
        this.users.sort = this.sort;
        this.loadPreviousSelectedUser();
      },
      error => {
        this.hc.snackbarError(JSON.stringify(error.error));
      }
    );
  }

  loadPreviousSelectedUser() {
    if (this.dataservice.lastUser != null) {
      this.users.data.forEach(row => {
        if (this.dataservice.lastUser == row['user']) {
          this.selection.select(row);
          this.dataservice.formatDataPermissionComponent(this.selection.selected);
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.users.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.users.data.forEach(row => this.selection.select(row));
    this.dataservice.formatDataPermissionComponent(this.selection.selected);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selectionToggle(data) {
    this.selection.toggle(data);
    if (this.selection.isSelected(data)) {
      this.dataservice.formatDataPermissionComponent(this.selection.selected);
    } else {
      // console.log('false block ', this.selection.selected);
      this.dataservice.formatDataPermissionComponent(this.selection.selected);
    }
  }

  openAddUserDialog() {
    const addUserdialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '32vw',
      height: '37vh'
    });

    addUserdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerservice.loadSpinner();
      }
    });
  }

  openDeleteUserDialog() {
    if (this.dataservice.checkDeleteUserSelection(this.selection.selected)) {
      const deleteUserdialogRef = this.dialog.open(DeleteUserDialogComponent, {
        width: '32vw',
        height: '42vh',
        data: this.selection.selected
      });

      deleteUserdialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinnerservice.loadSpinner();
        }
      });
    } else {
      this.hc.snackbarError('Please select valid user for delete');
    }
  }
}
