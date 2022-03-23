import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {icons} from "./Timeline"

export function Overview({teams, throws, timeline, ...props}) {
    return (
        <div className={"px-2 py-2 space-y-4"}>
            {teams.map(team => {
                return <TeamTable
                    key={team.id}
                    team={team}
                    timeline={timeline}
                    throws={throws}
                />
            })}
        </div>
    )
}

function TeamTable({team, timeline, throws, ...props}) {
    return (
        <div className={"flex border rounded border-gray-100 dark:border-gray-400 bg-white dark:bg-gray-800 shadow-md"}>
            <HeaderColumn team={team} throws={throws}/>
            <TimelineColumn team={team} timeline={timeline}/>
        </div>
    )
}

function HeaderColumn({team, throws, ...props}) {
    return (
        <div className={"w-1/3 divide-y divide-gray-300 dark:divide-gray-500"}>
            {team.players.map(player => {
                return <div
                    className={`text-${team.color}-600 dark:text-${team.color}-500 pl-2 pt-1 h-8 font-bold truncate `}
                    key={player.id}
                >
                    {player.name || "..."} ({throws[player.id]})
                </div>
            })}
        </div>
    )
}

function TimelineColumn({team, timeline, ...props}) {
    return (
        <div className={"w-2/3 border-l dark:border-gray-400 divide-y divide-gray-300 dark:divide-gray-500 overflow-y-scroll "}>
            {team.players.map(player => {
                return <Row
                    key={player.id}
                    timeline={timeline}
                    player={player}
                    color={team.color}
                />
            })}
        </div>
    )
}

function Row({player, timeline, color}) {
    console.log(timeline
        .filter(entry => entry.playerId === player.id))

    const iconList = timeline
        .filter(entry => entry.playerId === player.id)
        .map((entry, i) => {
            return <FontAwesomeIcon
                icon={icons[entry.action]}
                className={"mr-1 fa-w-16"} // we have to use fa-w-16 instead of w-16 to set the width successfully
                key={i}
            />
        })

    return (
        <div className={`text-${color}-600 dark:text-${color}-500 font-bold flex flex-row pt-2 px-2 h-8`}>
            {iconList}
        </div>
    )
}