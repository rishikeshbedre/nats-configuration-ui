import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './home/user/user.component';
import { PermissionsComponent } from './home/permissions/permissions.component';
import { RestApiService } from './services/rest-api.service';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AddUserDialogComponent } from './home/user/add-user-dialog/add-user-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteUserDialogComponent } from './home/user/delete-user-dialog/delete-user-dialog.component';
import { AddTopicDialogComponent } from './home/permissions/add-topic-dialog/add-topic-dialog.component';
import { DeleteTopicDialogComponent } from './home/permissions/delete-topic-dialog/delete-topic-dialog.component';
import { SpinnerService } from './services/spinner.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    PermissionsComponent,
    AddUserDialogComponent,
    DeleteUserDialogComponent,
    AddTopicDialogComponent,
    DeleteTopicDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [RestApiService, DataService, HomeComponent, SpinnerService],
  bootstrap: [AppComponent],
  entryComponents: [AddUserDialogComponent, DeleteUserDialogComponent, AddTopicDialogComponent, DeleteTopicDialogComponent]
})
export class AppModule { }
