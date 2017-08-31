import { AppPage } from "./app.po";

describe("BlackBox App", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it("should display welcome message", () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual("Bienvenue dans l'application BlackBox !");
  });
});
