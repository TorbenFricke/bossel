import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBowlingBall, faPause, faUndo} from "@fortawesome/free-solid-svg-icons";
import {
    actions,
    findPlayerById,
    findTeamByPlayerId,
    findThrowOrder,
    generateTimelineEntry,
    saveToLocalstorage,
} from "./gameLogic"
import moment from "moment";
import 'moment/locale/de'


export const icons = {}
icons[actions.throw] = faBowlingBall
icons[actions.skip] = faPause

export function Timeline({timeline, teams, throws, actionCount, setTimeline, className, ...props}) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [throwOrder, setThrowOrder] = useState(findThrowOrder(teams, timeline));
    const [historyLength, setHistoryLength] = useState(10)
    const [undoCount, setUndoCount] = useState(0)

    useEffect(() => {
        setThrowOrder(findThrowOrder(teams, timeline))
    }, [teams, timeline]);

    function saveAndReturnTimeline(newTimeline) {
        saveToLocalstorage({timeline: newTimeline})
        return newTimeline
    }

    function performAction(playerId, action) {
        const timelineEntry = generateTimelineEntry(teams, playerId, action)
        setTimeline(state =>
            saveAndReturnTimeline([...state, timelineEntry])
        )
    }

    function undoAction(timestamp) {
        setUndoCount(undoCount + 1)
        setTimeline(state =>
            saveAndReturnTimeline(state.filter(entry => entry.timestamp !== timestamp))
        )
    }

    const navDown = (
            <a href={"#defaultScroll"} className={"underline ml-2 text-gray-500 text-sm"}>
                Nach unten...
            </a>
        )

    return (
        <div className={className}>
            <div className={"mx-auto pt-2"}>
                <div className={"text-center mb-2"}>
                    {historyLength < timeline.length ?
                        <div className={"mt-4"}>
                            <RoundButtonSmall onClick={() => setHistoryLength(historyLength + 10)}>
                                Weitere Anzeigen...
                            </RoundButtonSmall>
                            <div className={"text-gray-500 ml-2 mt-1 text-sm"}>
                                {timeline.length - historyLength} ausgebledet
                                {navDown}
                            </div>
                        </div>
                        :
                        navDown
                    }
                </div>
                <div>
                    {
                        timeline.slice(-historyLength).map((row, index) => {
                            const player = findPlayerById(teams, row.playerId)
                            //const isActive = index === timeline.length + activeIdx
                            return <TimelinePlayer
                                player={player}
                                //active={isActive}
                                key={row.timestamp}
                                dead={true}
                                timestamp={row.timestamp}
                                action={row.action}
                                onClick={() => setActiveIdx(index - timeline.length)}
                                onUndo={() => undoAction(row.timestamp)}
                                color={findTeamByPlayerId(teams, player.id).color}
                            />
                        })
                    }
                </div>
                {timeline.length > 0 &&
                    <div className={"mx-2 my-2 flex"} id={"defaultScroll"}>
                        <div className={"border-t border-gray-300 dark:border-gray-500 h-0 flex-grow  mt-3"}/>
                        <div className={"flex-initial text-gray-600 dark:text-gray-400 mx-2"}>
                            Als Nächstes:
                        </div>
                        <div className={"border-t border-gray-300 dark:border-gray-500 h-0 flex-grow mt-3"}/>
                    </div>
                }
                <div>
                    {
                        throwOrder.map((player, index) => {
                            return <TimelinePlayer
                                throws={throws[player.id]}
                                player={player}
                                active={index === activeIdx}
                                key={player.id + "_" + undoCount + "_" + actionCount[player.id] + "_" + throws[player.id]}
                                onClick={() => setActiveIdx(index)}
                                onThrow={() => performAction(player.id, actions.throw)}
                                onSkip={() => performAction(player.id, actions.skip)}
                                color={findTeamByPlayerId(teams, player.id).color}
                            />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

function TimelinePlayer({setTimeline, player, throws, timestamp, color, action, ...props}) {
    const [dead, setDead] = useState(action !== undefined)
    const [timeoutRef, setTimeoutRef] = useState()

    function click(handler=props.onThrow) {
        setDead(!dead)
        if (timeoutRef !== undefined) {
            clearTimeout(timeoutRef)
            setTimeoutRef()
        } else {
            let timeout = setTimeout(() => {
                dead ? props.onUndo() : handler()
            }, 1000)
            setTimeoutRef(timeout)
        }
    }

    return (
        <div
            className={`first:border-t border-b duration-1000
            h-14 text-${color}-600 dark:text-${color}-400 
            bg-white dark:bg-gray-800 border-gray-200 dark:border-black`}
            onClick={props.onClick}
        >

            <div className={`absolute h-14
            bg-${color}-100 border-gray-300 dark:bg-${color}-900 dark:bg-opacity-70
            dark:bg-gray-800 border-gray-200 dark:border-black
            first:border-t border-b 
            ${dead ? "w-0" : "w-full"} transition-width duration-1000`}/>

            <div className={"relative flex ml-3 mr-2 z-0"}>
                <div
                    className={
                        `w-9 h-9 rounded-full mt-2.5 mr-3 text-center border-2 
                        ${dead ? "text-opacity-50 border-opacity-50" : ""} transition duration-1000 
                        border-${color}-400
                        bg-gray-700 dark:bg-black bg-opacity-5 dark:bg-opacity-30 
                        text-${color}-500 dark:text-${color}-300 dark:border-${color}-300`
                    }
                    onClick={() => click(props.onThrow)}
                >
                    {dead &&
                        <FontAwesomeIcon icon={faUndo} className={"mt-2"}/>
                    }
                </div>
                <div className={`flex-initial truncate my-4 font-bold`}>
                    {action === actions.skip && <FontAwesomeIcon icon={icons[action]} className={"mr-2 mt-1"}/>}
                    {player.name || "..."}
                    {timestamp !== undefined &&
                    <span className={`font-normal ml-2 text-sm text-opacity-70`}>
                        {moment(timestamp).locale("de").fromNow()}
                    </span>
                    }
                </div>
                {throws !== undefined &&
                    <div className={`ml-2 mt-3 font-bold flex-initial h-8 w-8 pt-1 text-center rounded-full 
                    bg-${color}-50 dark:bg-${color}-900 ${dead ? " opacity-0" : ""} transition-opacity`}>
                        {throws}
                    </div>
                }
                <div className={"flex-grow"}/>
                <div className={"flex-0"}>
                    {props.active && action === undefined && <ThrowButtons
                        onThrow={() => click(props.onThrow)}
                        onSkip={() => click(props.onSkip)}
                        color={color}
                        className={dead ? "transition-opacity opacity-0" : ""}
                    />}
                </div>
            </div>

        </div>
    )
}

function ThrowButtons({className, ...props}) {
    return (
        <div className={"flex mt-2"}>
            <RoundButton className={"flex-grow ml-1 " + className}  onClick={props.onSkip} color={props.color}>
                <FontAwesomeIcon icon={icons[actions.skip]} className={"mr-2"}/>
                Aussetzen
            </RoundButton>
        </div>
    )
}

function UndoButtons(props) {
    return (
        <RoundButton className={"mt-2 w-full"} onClick={props.onUndo}>
            <FontAwesomeIcon icon={faUndo} className={"mr-2"}/>
            Rückgängig
        </RoundButton>
    )
}

function RoundButton({color="gray", ...props}) {
    return (
        <button
            className={`bg-white dark:bg-black dark:bg-opacity-30 border border-${color}-500 dark:border-${color}-300 
            text-${color}-500 dark:text-${color}-300 h-10 py-auto px-3 rounded-full shadow-sm ` + props.className}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}

function RoundButtonSmall(props) {
    return (
        <button
            className={`bg-white dark:bg-gray-800 dark:text-gray-400 border border-gray-400 text-gray-600 
            py-1 text-sm px-3 rounded-full shadow-sm ` + props.className}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}