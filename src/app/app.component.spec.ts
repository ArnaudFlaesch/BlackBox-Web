import { TestBed, async } from "@angular/core/testing";

import { BlackBoxComponent } from "./app.component";

describe("BlackBoxComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlackBoxComponent
      ],
    }).compileComponents();
  }));

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(BlackBoxComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it("should have title as 'BlackBox'", async(() => {
    const fixture = TestBed.createComponent(BlackBoxComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("BlackBox");
  }));

  it("should render title in a h1 tag", async(() => {
    const fixture = TestBed.createComponent(BlackBoxComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain("Bienvenue dans l'application BlackBox !");
  }));
});
