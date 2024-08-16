import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {TopBarClass} from "./skeleton/class/TopBarClass.ts"
import {PageClass} from "./skeleton/class/PageClass.ts"

import Skeleton from './skeleton/Skeleton'

function List() {
    return (
        <ul>
            {
                [1, 2, 3].map(e => <li key={e}>{e}</li>)
            }
        </ul>
    )
}

function App() {
    let topBar_1 = new TopBarClass(<h1>Left</h1>, <h1>Center</h1>, <h1>Right</h1>);

    let page_1 = new PageClass(topBar_1, <h1>Left</h1>, <h1>Right</h1>)
    let page_2 = new PageClass(topBar_1, <h1>Left</h1>, <List/>)

    return (
        <Router>
            <Routes>
                <Route path={"/ui"} element={<Skeleton page={page_1}/>}/>
                <Route path={"/ui/page"} element={<Skeleton page={page_2}/>}/>
            </Routes>
        </Router>
    )
}

export default App
