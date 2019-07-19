_getCrumbs(param) {
    //!!!DONT RM BELOW!!!
    // "/:sport_name/:sport_id/competitions/:comp_name?/:event_part(.*/events)?/:event_name?/:market_part(.*/markets)?/:market_name?/:sel_part(.*/selections)?/:rest*"
    // let linkParams = [
    // 	'sport_name',
    // 	'sport_id',
    // 	'comp_name',
    // 	'event_part',
    // 	'event_name',
    // 	'market_part',
    // 	'market_name',
    // 	'sel_part',

    // 	'rest'
    // ]

    const rootRoutePaths = [
        {
            path: "sport_name", //string route
            label: "Sport Name", //screen name
            isParam: true, //if is :sport_name OR sport_name, instead of ":" in `path` value
            isNextCrumbBreak: false, //break point for crumb
            isCrumbName: true
        },
        {
            path: "sport_id",
            label: "Sport ID",
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: false,
            isID: true
        },
        {
            path: "competitions",
            label: "Competitions",
            isParam: false,
            isNextCrumbBreak: true,
            isCrumbName: false
        },
        {
            path: "comp_name",
            label: "Competition Name",
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: true,
            joinWith: "country",
            startEnclose: "(",
            endEnclose: ")"
        },
        {
            path: "comp_id",
            label: "Competition ID",
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: false,
            isID: true
        },
        {
            path: "country",
            label: "Country",
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: false
        },
        {
            path: "event_part",
            label: "Events",
            isParam: true,
            isNextCrumbBreak: true,
            isCrumbName: false
        },
        {
            path: "event_name",
            label: "Event Name",
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: true
        },
        {
            path: "market_part",
            label: "Markets",
            isParam: true,
            isNextCrumbBreak: true,
            isCrumbName: false,
            hasID: true
        },
        {
            path: "market_name",
            label: "Market Name",
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: true
        },
        {
            path: "sels_part",
            label: "Selections",
            isParam: true,
            isNextCrumbBreak: true,
            isCrumbName: false,
            hasID: true
        },
        {
            path: "sel_name",
            label: "Selection Name",
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: true
        },
        {
            path: "sel_part",
            label: "Selection",
            isParam: true,
            isNextCrumbBreak: true,
            isCrumbName: false,
            hasID: true
        },
        {
            path: "rest",
            label: "Rest", //Up to 15 levels could be included
            isParam: true,
            isNextCrumbBreak: false,
            isCrumbName: false
        }
    ]

    //algo for tab in the end of route instead of everywhere
    let i = 0
    let crumbs = []
    let currCrumbsIndex = 0 // NOT cucumberIndex

    while (i < rootRoutePaths.length - 1) {
        let routePath

        if (rootRoutePaths[i].isParam && !param[rootRoutePaths[i].path]) {
            break
        }

        if (crumbs[currCrumbsIndex] === undefined) {
            crumbs[currCrumbsIndex] = {}
            crumbs[currCrumbsIndex].link = ""
        }

        if (rootRoutePaths[i].isCrumbName) {
            if (rootRoutePaths[i].joinWith) {
                crumbs[currCrumbsIndex].name =
                    decodeURIComponent(param[rootRoutePaths[i].path]) +
                    rootRoutePaths[i].startEnclose +
                    decodeURIComponent(param[rootRoutePaths[i].joinWith]) +
                    rootRoutePaths[i].endEnclose
            } else {
                crumbs[currCrumbsIndex].name = decodeURIComponent(
                    param[rootRoutePaths[i].path]
                )
            }
        }

        if (rootRoutePaths[i].isParam) {
            routePath = `/${param[rootRoutePaths[i].path]}`
        } else {
            routePath = `/${rootRoutePaths[i].path}`
        }

        crumbs[currCrumbsIndex].link += routePath
        //to add ID, refactor later
        if (rootRoutePaths[i].isID) {
            crumbs[currCrumbsIndex].id = decodeURIComponent(
                param[rootRoutePaths[i].path]
            )
        } else if (rootRoutePaths[i].hasID) {
            crumbs[currCrumbsIndex].id = param[rootRoutePaths[i].path].match(
                /^(.*?)\/(.*)/
            )[1]
        }

        //to add ID, refactor later
        if (rootRoutePaths[i].isNextCrumbBreak) {
            crumbs[currCrumbsIndex].level = rootRoutePaths[i].label
            currCrumbsIndex++
        }

        i++
    }

    const tabRoute = crumbs.reduce((acc, newCrumb) => {
        if (newCrumb.level) return acc
        return newCrumb.link
    }, "")

    if (tabRoute.length) {
        crumbs = crumbs.slice(0, -1)
    }

    crumbs = crumbs.map((newCrumb, i) => {
        const resLink =
            crumbs.slice(0, i + 1).reduce((link, newCrumb) => {
                return link + newCrumb.link
            }, "") + tabRoute

        return {
            ...newCrumb,
            link: resLink
        }
    })

    return crumbs
}
