import "./Skeleton.css"

function TopBar(props) {
    let topBar = props.topBar

    return (
        <div className="skeleton-main-topbar">
            <div className="skeleton-main-topbar-section-left">
                {
                    topBar?.sectionLeft ?? <></>
                }
            </div>
            <div className="skeleton-main-topbar-section-center">
                {
                    topBar?.sectionCenter ?? <></>
                }
            </div>
            <div className="skeleton-main-topbar-section-right">
                {
                    topBar?.sectionRight ?? <></>
                }
            </div>
        </div>
    )
}

function Skeleton(props) {
    let {topBar, bodyLeft, bodyRight} = props.page

    return (
        <div className="skeleton-main">
            <TopBar topBar={topBar}/>
            <div className="skeleton-main-body">
                <div className="skeleton-main-body-left">
                    {
                        bodyLeft ?? <></>
                    }
                </div>
                <div className="skeleton-main-body-right">
                    {
                        bodyRight ?? <></>
                    }
                </div>
            </div>
        </div>
    )
}

export default Skeleton