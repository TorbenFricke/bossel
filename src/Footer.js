import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {faBowlingBall, faTable, faUserFriends} from "@fortawesome/free-solid-svg-icons";
//faTable


export const navOptions = {
    teams: 1,
    timeline: 0,
    overview: 2,
}

export function Footer({navIndex, setNavIndex, ...props}) {
    return (
        <div className={"h-20"}>
            <div
                className={"fixed bg-white dark:bg-black bottom-0 w-full border-t border-gray-200 dark:border-gray-600 flex px-2 space-x-0 justify-center drop-shadow"}>
                <FooterNavButton
                    icon={faBowlingBall}
                    active={navIndex === navOptions.timeline}
                    onClick={() => setNavIndex(navOptions.timeline)}>
                    Spielen
                </FooterNavButton>
                <FooterNavButton
                    icon={faUserFriends}
                    active={navIndex === navOptions.teams}
                    onClick={() => setNavIndex(navOptions.teams)}>
                    Teams
                </FooterNavButton>
                <FooterNavButton
                    icon={faTable}
                    active={navIndex === navOptions.overview}
                    onClick={() => setNavIndex(navOptions.overview)}>
                    Überblick
                </FooterNavButton>
            </div>
        </div>
    )
}

function FooterNavButton({active, color, ...props}) {
    const activeClass = `text-blue-600 dark:text-white`
    const inactiveClass = `dark:text-gray-500 text-gray-500`
    return (
        <button
            className={`text-center h-20 mb-1 pb-7 px-4 pt-2 rounded-xl flex-1 ${active ? activeClass : inactiveClass} ` + props.className}
            onClick={props.onClick}
        >
            <div>
                <FontAwesomeIcon icon={props.icon}/>
            </div>
            <div>
                {props.children}
            </div>
        </button>
    )
}