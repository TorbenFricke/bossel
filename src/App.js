import React, {useEffect, useState} from 'react';
import {Timeline} from "./Timeline";
import {Header} from "./Header";
import {Footer, navOptions} from "./Footer";
import {initialGameState, saveToLocalstorage} from "./gameLogic";
import {TeamSetup} from "./Teams";
import {Overview} from "./Overview";


const _initialGameState = initialGameState()

function App() {
    const [navIndex, setNavIndex] = useState(navOptions.teams)
    const [scrollPosition, setScrollPosition] = useState({});

    const [teams, setTeams] = useState(_initialGameState.teams)
    const [timeline, setTimeline] = useState(_initialGameState.timeline)

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

        const handleScroll = () => {
            let newState = {}
            newState[navIndex] = window.scrollY
            setScrollPosition(state => ({...state, ...newState}))
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [navIndex])


    useEffect(() => {
        try {
            navIndex === navOptions.timeline && document.getElementById("defaultScroll").scrollIntoView()
            navIndex === navOptions.teams && window.scrollTo({
                top: 0,
                behavior: 'auto'
            })
        } catch (e) {}

        /*
        let position = scrollPosition[navIndex]

        try {
            //console.log(navIndex)
            //console.log(scrollPosition)
            //console.log(scrollPosition[navIndex])
            position === undefined ?
                document.getElementById("defaultScroll").scrollIntoView() :
                window.scrollTo({
                    top: position,
                    behavior: 'auto'
                })
        } catch (e) {}
        */

    }, [navIndex])

    return (
        <div className={"bg-gray-50 min-h-screen"}>
            <Header teams={teams}/>

            {navIndex === navOptions.timeline && <Timeline
                //className={navIndex === navOptions.timeline ? "" : "hidden"}
                teams={teams}
                timeline={timeline}
                setTimeline={setTimeline}
                setTeams={setTeams}
            />}

            {navIndex === navOptions.teams && <TeamSetup
                teams={teams}
                setTeams={setTeams}
                reset={reset}
            />}

            {navIndex === navOptions.overview && <Overview
                teams={teams}
                timeline={timeline}
            />}

            <Footer navIndex={navIndex} setNavIndex={setNavIndex}/>
        </div>
    )
}


export default App;
