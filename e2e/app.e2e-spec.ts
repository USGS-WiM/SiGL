import { SiglPage } from "./app.po";

describe("sigl App", () => {
    let page: SiglPage;

    beforeEach(() => {
        page = new SiglPage();
    });

    it("should display message saying app works", () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual("app works!");
    });
});
