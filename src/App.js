import React, {useEffect, useState} from 'react';
import {Timeline} from "./Timeline";
import {Header} from "./Header";
import {Footer, navOptions} from "./Footer";
import {countThrows, initialGameState, saveToLocalstorage} from "./gameLogic";
import {TeamSetup} from "./Teams";
import {Overview} from "./Overview";


const _initialGameState = initialGameState()

function App() {
    const [navIndex, setNavIndex] = useState(navOptions.teams)

    // persistent (between reloads) game state
    const [teams, setTeams] = useState(_initialGameState.teams)
    const [timeline, setTimeline] = useState(_initialGameState.timeline)

    // ephemeral game state
    const [throws, setThrows] = useState({})

    function reset() {
        const state = initialGameState()
        setTeams(state.teams)
        setTimeline(state.timeline)
        saveToLocalstorage(state)
    }

    useEffect(() => {
        const timeline = JSON.parse(localStorage.getItem("timeline"))
        const teams = JSON.parse(localStorage.getItem("teams"))
        const nav = JSON.parse(localStorage.getItem("navIndex"))
        if (timeline) { setTimeline(timeline) }
        if (teams) { setTeams(teams) }
        if (nav !== undefined) { setNavIndex(nav) }
    }, [])

    useEffect(() => {
        localStorage.setItem("navIndex", JSON.stringify(navIndex))

        try {
            navIndex === navOptions.timeline && document.getElementById("defaultScroll").scrollIntoView()
            navIndex === navOptions.teams && window.scrollTo({
                top: 0,
                behavior: 'auto'
            })
        } catch (e) {}

    }, [navIndex])

    useEffect(() => {
        setThrows(countThrows(timeline))
    }, [timeline])

    return (
        <div className={"bg-gray-50 min-h-screen"}>
            <Header teams={teams} throws={throws}/>

            {navIndex === navOptions.timeline && <Timeline
                //className={navIndex === navOptions.timeline ? "" : "hidden"}
                teams={teams}
                throws={throws}
                timeline={timeline}
                setTimeline={setTimeline}
            />}

            {navIndex === navOptions.teams && <TeamSetup
                teams={teams}
                setTeams={setTeams}
                reset={reset}
            />}

            {navIndex === navOptions.overview && <Overview
                teams={teams}
                timeline={timeline}
                throws={throws}
            />}

            <Footer navIndex={navIndex} setNavIndex={setNavIndex}/>
        </div>
    )
}


export default App;
