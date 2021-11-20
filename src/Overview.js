import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {icons} from "./Timeline"

export function Overview({teams, timeline, ...props}) {
    return (
        <div className={"px-2 py-2 space-y-4"}>
            {teams.map(team => {
                return <TeamTable
                    team={team}
                    timeline={timeline}
                />
            })}
        </div>
    )
}

function TeamTable({team, timeline, ...props}) {
    return (
        <div className={"flex border rounded border-gray-100 bg-white shadow-md"}>
            <HeaderColumn team={team}/>
            <TimelineColumn team={team} timeline={timeline}/>
        </div>
    )
}

function HeaderColumn({team, ...props}) {
    return (
        <div className={"w-1/3 divide-y divide-gray-300"}>
            {team.players.map(player => {
                return <div className={`text-${team.color}-600 pl-2 py-1 font-bold truncate `}>
                    {player.name || "..."}
                </div>
            })}
        </div>
    )
}

function TimelineColumn({team, timeline, ...props}) {
    return (
        <div className={"w-2/3 border-l divide-y divide-gray-300 overflow-y-scroll "}>
            {team.players.map(player => {
                return <Row
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
        .map(entry => {
            return <FontAwesomeIcon icon={icons[entry.action]} className={"mr-1"}/>
        })

    return (
        <div className={`text-${color}-600 font-bold flex flex-row p-2 `}>
            {iconList}
        </div>
    )
}