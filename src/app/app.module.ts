import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { BlackBoxComponent } from "./app.component";
import {UserService} from "./service/user.service";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HomeComponent } from "./components/home/home.component";
import { DndDirective } from "./directives/dnd.directive";
import {FileService} from "./service/file.service";

@NgModule({
  declarations: [
    BlackBoxComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DndDirective
  ],
  imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      HttpModule
  ],
  providers: [UserService, FileService],
  bootstrap: [BlackBoxComponent]
})
export class AppModule { }
