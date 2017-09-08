import { TestBed, async } from "@angular/core/testing";

import { BlackBoxComponent } from "./app.component";

describe("BlackBoxComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BlackBoxComponent ]
        })
        .compileComponents();
    }));

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(BlackBoxComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));


  it("should render banner", async(() => {
    const fixture = TestBed.createComponent(BlackBoxComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("div").textContent).toContain("BlackBox - Stockage et partage de fichiers sécurisés");
  }));
});
