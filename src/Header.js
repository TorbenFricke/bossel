import React from "react";

export function Header({teams, throws}) {
    return (
        <div className={"sticky bg-white top-0 h-16 w-full flex px-7 py-2 shadow-md"}>
            <div className={"font-bold text-gray-600 my-auto"}>Würfe:</div>
            <div className={"flex-grow"}/>
            {
                teams.map(team => {
                    return <ThrowsHeaderStat color={team.color} key={team.id}>
                        {throws[team.id]}
                    </ThrowsHeaderStat>
                })
            }
        </div>
    )
}

export function ThrowsHeaderStat(props) {
    return (
        <div
            className={`text-${props.color}-500 bg-${props.color}-50 my-auto h-10 w-10 text-center py-2 rounded-full ml-3 font-bold ` + props.className}>
            {props.children}
        </div>
    )
}