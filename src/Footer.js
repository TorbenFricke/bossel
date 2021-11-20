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
        <div className={"h-16"}>
            <div
                className={"fixed bg-white bottom-0 w-full border-t border-gray-200 flex py-2 px-2 space-x-2 justify-center drop-shadow"}>
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
    const activeClass = `text-blue-600 `
    const inactiveClass = `hover:text-black`
    return (
        <button
            className={`text-gray-500 text-center h-12 px-4 py-auto rounded-xl flex-1 transition ${active ? activeClass : inactiveClass} ` + props.className}
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