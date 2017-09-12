import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisterComponent } from "./register.component";
import {UserService} from "../../services/user.service";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ RegisterComponent ],
        providers: [UserService]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should be created", () => {
      expect(component).toBeTruthy();
    });
});
