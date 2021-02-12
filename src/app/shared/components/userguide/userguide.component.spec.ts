import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserGuideComponent } from "./userguide.component";

describe("FilterComponent", () => {
    let component: UserGuideComponent;
    let fixture: ComponentFixture<UserGuideComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserGuideComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserGuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
