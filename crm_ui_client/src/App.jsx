import {useEffect, useState} from 'react'
import './App.css'

function TopBar(props) {
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
}

function App() {
    const [currentUser, setCurrentUser] = useState(null)

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
    )
}

export default App
