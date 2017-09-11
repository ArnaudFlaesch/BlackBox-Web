import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeComponent } from "./home.component";
import {DndDirective} from "../../directives/dnd.directive";
import {Http, HttpModule} from "@angular/http";
import {UserService} from "../../service/user.service";
import {FileService} from "../../service/file.service";
import {MdDialog} from "@angular/material";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [HomeComponent],
        imports: [HttpModule],
        providers: [UserService, FileService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
