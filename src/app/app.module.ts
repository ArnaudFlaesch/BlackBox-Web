import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { BlackBoxComponent } from "./app.component";

@NgModule({
  declarations: [
    BlackBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [BlackBoxComponent]
})
export class AppModule { }
