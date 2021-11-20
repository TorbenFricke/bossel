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

export function Timeline({timeline, teams, throws, setTimeline, className, ...props}) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [throwOrder, setThrowOrder] = useState(findThrowOrder(teams, timeline));
    const [historyLength, setHistoryLength] = useState(10)

    useEffect(() => {
        setThrowOrder(findThrowOrder(teams, timeline))
    }, [teams, timeline]);


    function performAction(playerId, action) {
        const timelineEntry = generateTimelineEntry(teams, playerId, action)
        setTimeline(state => [...state, timelineEntry])
        saveToLocalstorage({timeline: [...timeline, timelineEntry]})
    }

    function undoAction(index) {
        timeline.splice(index, 1)
        setTimeline(timeline)
        saveToLocalstorage({timeline: timeline})
    }

    return (
        <div className={className}>
            <div className={"max-w-md mx-auto"}>
                <div className={"text-center mb-2"}>
                    {historyLength < timeline.length ?
                        <div className={"mt-3"}>
                            <RoundButtonSmall onClick={() => setHistoryLength(historyLength + 10)}>
                                Weitere Anzeigen...
                            </RoundButtonSmall>
                            <div className={"text-gray-500 ml-2 mt-1 text-sm"}>
                                {timeline.length - historyLength} ausgebledet
                                <a href={"#defaultScroll"} className={"underline ml-2"}>
                                    Nach unten...
                                </a>
                            </div>
                        </div>
                        :
                        <a href={"#defaultScroll"} className={"underline text-gray-600 text-sm ml-2"}>
                            Nach unten...
                        </a>
                    }
                </div>
                <div>
                    {
                        timeline.slice(-historyLength).map((row, index) => {
                            const player = findPlayerById(teams, row.playerId)
                            const isActive = index === timeline.length + activeIdx
                            return <TimelinePlayer
                                player={player}
                                active={isActive}
                                key={index - timeline.length}
                                dead={true}
                                timestamp={row.timestamp}
                                actionIcon={row.action === actions.skip ? icons[actions.skip] : null}
                                onClick={() => setActiveIdx(index - timeline.length)}
                                onUndo={() => undoAction(
                                    index + Math.max(0, timeline.length - historyLength))}
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
                                key={index}
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

function TimelinePlayer({setTimeline, player, throws, timestamp, color, ...props}) {
    let classes = props.dead ?
        `bg-white bg-${color}-${props.active ? "50" : "0"} } dark:bg-gray-800 border-gray-200 dark:border-black` :
        `bg-${color}-100 border-gray-300 dark:bg-${color}-800 dark:bg-opacity-70 dark:border-black `

    return (
        <div
            className={`first:border-t border-b
            pl-5 pr-2 h-14 text-${color}-600 dark:text-${color}-400 ` + classes}
            onClick={props.onClick}
        >
            <div className={"flex"}>
                <div className={`flex-initial truncate my-4 font-bold`}>
                    {player.name || "..."}
                    {props.actionIcon && <FontAwesomeIcon icon={props.actionIcon} className={"ml-2 mt-1"}/>}
                    {timestamp !== undefined &&
                    <span className={`font-normal ml-2 text-sm text-opacity-70`}>
                        {moment(timestamp).locale("de").fromNow()}
                    </span>
                    }
                </div>
                {throws !== undefined &&
                    <div className={`ml-2 mt-3 font-bold flex-initial h-8 w-8 pt-1 text-center rounded-full 
                    bg-${color}-50 dark:bg-${color}-900`}>
                        {throws}
                    </div>
                }
                <div className={"flex-grow"}/>
                <div className={"flex-0"}>
                    {props.active && !props.dead &&
                        <ThrowButtons onThrow={props.onThrow} onSkip={props.onSkip} color={color}/>}
                    {props.active && props.dead &&
                        <UndoButtons onUndo={props.onUndo}/>}
                </div>
            </div>
        </div>
    )
}

function ThrowButtons(props) {
    return (
        <div className={"flex mt-2"}>
            <RoundButton className={"flex-grow mr-1"} onClick={props.onThrow} color={props.color}>
                <FontAwesomeIcon icon={icons[actions.throw]} className={"mr-2"}/>
                Werfen
            </RoundButton>
            <RoundButton className={"flex-grow ml-1"}  onClick={props.onSkip} color={props.color}>
                <FontAwesomeIcon icon={icons[actions.skip]} className={""}/>
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
            className={`bg-white dark:bg-black dark:bg-opacity-30 border border-${color}-300 hover:border-${color}-700  
            text-${color}-500 dark:text-${color}-300 hover:text-${color}-800 h-10 py-auto px-3 rounded-full shadow-sm ` + props.className}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}

function RoundButtonSmall(props) {
    return (
        <button
            className={`bg-white dark:bg-gray-800 dark:text-gray-400 border border-gray-400 hover:border-gray-700 text-gray-600 
            hover:text-gray-800 py-1 text-sm px-3 rounded-full shadow-sm ` + props.className}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}