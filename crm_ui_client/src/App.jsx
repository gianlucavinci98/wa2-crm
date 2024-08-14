import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Skeleton from './skeleton/Skeleton'

/* function TopBar(props) {
    return (
        <div style={{
            backgroundColor: 'black',
            padding: '4px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            color: 'white'
        }}>
            {
                props.currentUser && props.currentUser.principal &&
                <>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <span style={{margin: "8px"}}>Name:</span>
                        <span style={{marginRight: "1em"}}>{props.currentUser.name}</span>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <span style={{margin: "8px"}}>Role:</span>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {props.currentUser.roles.map((it, index) => (
                                <span key={index}>{it.toUpperCase()}</span>
                            ))}
                        </div>
                    </div>
                    <form method={"post"} action={props.currentUser.logoutUrl}>
                        <input type="hidden" name="_csrf" value={props.currentUser.xsrfToken}/>
                        <button type={"submit"}>Logout</button>
                    </form>
                </>
            }
            {
                props.currentUser && props.currentUser.principal == null &&
                <button onClick={() => window.location.href = props.currentUser.loginUrl}>Login</button>
            }
        </div>
    )
} */

class TopBarClass {
    constructor(sectionLeft, sectionCenter, sectionRight) {
        this.sectionLeft = sectionLeft;
        this.sectionCenter = sectionCenter;
        this.sectionRight = sectionRight;
    }
}

class PageClass {
    constructor(topBar, bodyLeft, bodyRight) {
        if (!(topBar instanceof TopBarClass)) {
            throw new Error('topBar must be an instance of TopBar');
        }

        this.topBar = topBar;
        this.bodyLeft = bodyLeft;
        this.bodyRight = bodyRight;
    }
}

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
    /* const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch("/current-user")
                const currentUser = await res.json()
                setCurrentUser(currentUser)
            } catch (error) {
                setCurrentUser(null)
            }
        }

        fetchCurrentUser().then()
    }, [])

    return (
        <div>
            <TopBar currentUser={currentUser}/>
            {
                currentUser?.name !== ""
                    ?
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span>Principal</span>
                        <div>Username: {currentUser?.username}</div>
                        <div>Name: {currentUser?.name}</div>
                        <div>Surname: {currentUser?.surname}</div>
                        <div>Email: {currentUser?.email}</div>
                    </div>
                    :
                    <div>
                        <span>Not logged in</span>
                    </div>
            }
        </div>
    ) */

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
