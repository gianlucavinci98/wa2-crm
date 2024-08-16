import {JSX} from "react/jsx-dev-runtime";

export class TopBarClass {
    sectionLeft: JSX.Element
    sectionCenter: JSX.Element
    sectionRight: JSX.Element

    constructor(sectionLeft: JSX.Element, sectionCenter: JSX.Element, sectionRight: JSX.Element) {
        this.sectionLeft = sectionLeft;
        this.sectionCenter = sectionCenter;
        this.sectionRight = sectionRight;
    }
}
