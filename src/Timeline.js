import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBowlingBall, faPauseCircle, faUndo} from "@fortawesome/free-solid-svg-icons";
import {
    actions,
    findPlayerById,
    findTeamById,
    findTeamByPlayerId,
    findThrowOrder,
    generateTimelineEntry,
    saveToLocalstorage,
} from "./gameLogic"


const icons = {}
icons[actions.throw] = faBowlingBall
icons[actions.skip] = faPauseCircle

const historyLength = 50

export function Timeline({timeline, teams, setTimeline, setTeams, className, ...props}) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [throwOrder, setThrowOrder] = useState(findThrowOrder(teams, timeline));

    useEffect(() => {
        setThrowOrder(findThrowOrder(teams, timeline))
    }, [teams, timeline]);


    function performAction(playerId, action) {
        const team = findTeamByPlayerId(teams, playerId)
        const timelineEntry = generateTimelineEntry(teams, playerId, action, team.id)
        if (action === actions.throw) {
            team.throws += 1
            const player = findPlayerById(teams, playerId)
            player.throws += 1
            setTeams([...teams])
        }
        setTimeline([...timeline, timelineEntry])
        saveToLocalstorage({teams: teams, timeline: [...timeline, timelineEntry]})
    }

    function undoAction(index) {
        const timelineEntry = timeline.splice(index, 1)[0]
        if (timelineEntry.action === actions.throw) {
            const team = findTeamById(teams, timelineEntry.teamId)
            team.throws -= 1
            const player = findPlayerById(teams, timelineEntry.playerId)
            player.throws -= 1
            console.log(teams)
            setTeams([...teams])
        }
        setTimeline(timeline)
        saveToLocalstorage({teams: teams, timeline: [...timeline, timelineEntry]})
    }

    return (
        <div className={`px-2 py-2 ` + className}>
            <div className={"max-w-md mx-auto"}>
                {historyLength < timeline.length &&
                    <div className={"text-center mb-2 text-gray-600"}>
                        {timeline.length - historyLength} Einträge ausgebledet
                    </div>
                }
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
                        <div className={"border-t border-gray-300 h-0 flex-grow  mt-3"}/>
                        <div className={"flex-initial text-gray-600 mx-2"}>
                            Als Nächstes:
                        </div>
                        <div className={"border-t border-gray-300 h-0 flex-grow mt-3"}/>
                    </div>
                }
                <div>
                    {
                        throwOrder.map((player, index) => {
                            return <TimelinePlayer
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

function TimelinePlayer({setTimeline, player, ...props}) {
    const color = props.color || "black"

    let classes = props.dead ?
        `bg-white bg-${color}-${props.active ? "50" : "0"} } border-gray-200` :
        `bg-${color}-100 border-gray-300`

    return (
        <div
            className={`shadow-md first:rounded-t-xl last:rounded-b-xl first:border-t border-b border-l border-r
            pl-5 pr-2 h-14 text-${color}-600 ` + classes}
            onClick={props.onClick}
        >
            <div className={"flex"}>
                <div className={`flex-initial my-4 font-bold`}>
                    {player.name || "..."}
                    {props.actionIcon && <FontAwesomeIcon icon={props.actionIcon} className={"ml-2 text-xl mt-0.5"}/>}
                </div>
                {props.dead ||
                    <div className={`ml-2 mt-3 font-bold flex-initial h-8 w-8 pt-1 text-center rounded-full bg-${color}-50`}>
                        {player.throws || "0"}
                    </div>
                }
                <div className={"flex-grow"}/>
                <div>
                    {props.active && !props.dead && <ThrowButtons onThrow={props.onThrow} onSkip={props.onSkip}/>}
                    {props.active && props.dead && <UndoButtons onUndo={props.onUndo}/>}
                </div>
            </div>
        </div>
    )
}

function ThrowButtons(props) {
    return (
        <div className={"mt-2 flex"}>
            <RoundButton className={"flex-grow mr-1"} color={"green"} onClick={props.onThrow}>
                <FontAwesomeIcon icon={icons[actions.throw]} className={"mr-2"}/>
                Werfen
            </RoundButton>
            <RoundButton className={"flex-grow ml-1"} color={"yellow"} onClick={props.onSkip}>
                <FontAwesomeIcon icon={icons[actions.skip]} className={""}/>
            </RoundButton>
        </div>
    )
}

function UndoButtons(props) {
    return (
        <RoundButton className={"mt-2 w-full"} color={"blue"} onClick={props.onUndo}>
            <FontAwesomeIcon icon={faUndo} className={"mr-2"}/>
            Rückgängig
        </RoundButton>
    )
}

function RoundButton(props) {
    return (
        <button
            className={`bg-white border border-gray-400 hover:border-gray-700 text-gray-600 hover:text-gray-800 h-10 py-auto px-3 rounded-full shadow ` + props.className}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    )
}