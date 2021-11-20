import React, {useState} from "react";
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
        <div className={"flex border rounded border-gray-100 bg-white shadow-md"}>
            <HeaderColumn team={team} throws={throws}/>
            <TimelineColumn team={team} timeline={timeline}/>
        </div>
    )
}

function HeaderColumn({team, throws, ...props}) {
    return (
        <div className={"w-1/3 divide-y divide-gray-300"}>
            {team.players.map(player => {
                return <div
                    className={`text-${team.color}-600 pl-2 py-1 font-bold truncate `}
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
        <div className={"w-2/3 border-l divide-y divide-gray-300 overflow-y-scroll "}>
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
                className={"mr-1"}
                key={i}
            />
        })

    return (
        <div className={`text-${color}-600 font-bold flex flex-row p-2 `}>
            {iconList}
        </div>
    )
}