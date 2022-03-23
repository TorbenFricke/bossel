import React, {useEffect, useState} from 'react';
import {Timeline} from "./Timeline";
import {Header} from "./Header";
import {Footer, navOptions} from "./Footer";
import {countActions, countThrows, initialGameState, saveToLocalstorage} from "./gameLogic";
import {TeamSetup} from "./Teams";
import {Overview} from "./Overview";
import {setFromLocalStorage} from "./util";


const _initialGameState = initialGameState()

function App() {
    // persistent (between reloads) game state
    const [teams, setTeams] = useState(_initialGameState.teams)
    const [timeline, setTimeline] = useState(_initialGameState.timeline)
    const [navIndex, setNavIndex] = useState(navOptions.teams)

    // ephemeral game state
    const [throws, setThrows] = useState({})
    const [actionCount, setActionCount] = useState({})

    function reset() {
        const state = initialGameState()
        setTeams(state.teams)
        setTimeline(state.timeline)
        saveToLocalstorage(state)
    }

    // on first load
    useEffect(() => {
        setFromLocalStorage("timeline", setTimeline)
        setFromLocalStorage("teams", setTeams)
        setFromLocalStorage("navIndex", setNavIndex)
        // write initial team data on the very first load
        if (localStorage.getItem("teams") == null) {
            saveToLocalstorage({teams: _initialGameState.teams})
        }
    }, [])

    // when changing the tab
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

    // on every player action
    useEffect(() => {
        setThrows(countThrows(timeline))
        setActionCount(countActions(timeline))
    }, [timeline])

    return (
        <div>
            <Header teams={teams} throws={throws}/>

            {navIndex === navOptions.timeline && <Timeline
                //className={navIndex === navOptions.timeline ? "" : "hidden"}
                teams={teams}
                throws={throws}
                actionCount={actionCount}
                timeline={timeline}
                setTimeline={setTimeline}
            />}

            {navIndex === navOptions.teams && <TeamSetup
                teams={teams}
                actionCount={actionCount}
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
