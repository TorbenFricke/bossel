import React from "react";

export function Header({teams, throws}) {
    return (
        <div>
            <div className={"fixed bg-white dark:bg-black border-b dark:border-gray-600 top-0 h-12 w-full px-7 pb-2 flex shadow-md z-20"}>
                <div className={"font-bold text-gray-600 dark:text-gray-200 my-auto"}>
                    Würfe:
                </div>
                <div className={"flex-grow"}/>
                {
                    teams.map(team => {
                        return <ThrowsHeaderStat color={team.color} key={team.id}>
                            {throws[team.id]}
                        </ThrowsHeaderStat>
                    })
                }
            </div>
            <div className={"sticky h-12 z-0"}/>
        </div>
    )
}

export function ThrowsHeaderStat(props) {
    return (
        <div
            className={`
            text-${props.color}-500 bg-${props.color}-50 dark:bg-${props.color}-800 dark:text-${props.color}-100
            my-auto h-9 w-9 text-center pt-1.5 rounded-full
            ml-3 font-bold ` + props.className}>
            {props.children}
        </div>
    )
}