import {JSX} from "react/jsx-dev-runtime";
import {TopBarClass} from "./TopBarClass";

export class PageClass {
    topBar: TopBarClass
    bodyLeft: JSX.Element
    bodyRight: JSX.Element

    constructor(topBar: TopBarClass, bodyLeft: JSX.Element, bodyRight: JSX.Element) {
        this.topBar = topBar;
        this.bodyLeft = bodyLeft;
        this.bodyRight = bodyRight;
    }
}
