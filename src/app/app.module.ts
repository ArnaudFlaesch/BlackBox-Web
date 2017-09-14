import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { BlackBoxComponent } from "./app.component";
import {UserService} from "./services/user.service";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HomeComponent } from "./components/home/home.component";
import { DndDirective } from "./directives/dnd.directive";
import {FileService} from "./services/file.service";
import {MdDialogModule, MdFormFieldModule} from "@angular/material";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {DialogNewFileComponent} from "./components/dialogs/DialogNewFileComponent";
import {DialogNewFolderComponent} from "./components/dialogs/DialogNewFolderComponent";
import {DialogUserInfoComponent} from "./components/dialogs/DialogUserInfoComponent";

@NgModule({
    declarations: [
        BlackBoxComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        DndDirective,
        DialogNewFileComponent,
        DialogNewFolderComponent,
        DialogUserInfoComponent
  ],
  imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      HttpModule,
      MdDialogModule,
      MdFormFieldModule,
      NoopAnimationsModule
  ],
    entryComponents: [DialogNewFileComponent, DialogNewFolderComponent, DialogUserInfoComponent],
    providers: [UserService, FileService],
    bootstrap: [BlackBoxComponent]
})
export class AppModule { }
