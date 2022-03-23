import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faPen, faPlus, faBowlingBall, faRedo, faUsers} from "@fortawesome/free-solid-svg-icons";
import {newPlayer, newTeam, saveToLocalstorage} from "./gameLogic";

export function TeamSetup({teams, setTeams, reset, actionCount, ...props}) {
    return (
        <div className={"px-2 py-2 space-y-4"}>
            {teams.map((team, i) => {
                return <Team
                    team={team}
                    actionCount={actionCount}
                    setTeam={_team => {
                        teams[i] = _team
                        setTeams([...teams])
                        saveToLocalstorage({teams: teams})
                    }}
                    deleteTeam={() => {
                        teams.splice(i, 1)
                        setTeams([...teams])
                        saveToLocalstorage({teams: teams})
                    }}
                    key={team.id}
                />
            })}
            <button
                className={"w-full rounded-xl shadow-md py-3 text-center border bg-white text-blue-600 " +
                "dark:bg-gray-800 dark:border-gray-600 dark:text-blue-400"}
                onClick={() => setTeams([...teams, newTeam()])}
            >
                <FontAwesomeIcon className={"mr-2"} icon={faUsers}/>
                Neues Team
            </button>
            <ResetButton reset={reset}/>
            <InfoBox/>
        </div>
    )
}

function InfoBox() {
    return (
        <p className={"text-center dark:text-gray-400"}>
            Alle Daten werden <a
                className={"underline text-blue-700 dark:text-blue-500"}
                href={"https://de.wikipedia.org/wiki/Web_Storage#localStorage"}
                rel={"noreferrer"}
                target={"_blank"}
            >
                lokal auf deinem Gerät gespeichert
            </a>.
            Wenn du deinen Browserverlauf löscht, sind auch alle Boßeldaten weg. Öffne die Boßel App nur ein mal, damit
            es nicht zu Versionskonflikten kommt.
        </p>
    )
}

function ResetButton({reset, ...props}) {
    const [showModal, setShowModal] = useState(false)

    return (
        <div>
            <button
                className={"w-full rounded-xl bg-white dark:b shadow-md py-3 text-red-600 text-center " +
                "dark:bg-gray-800 dark:border-gray-600 dark:text-red-400 border"}
                onClick={() => setShowModal(true)}
            >
                <FontAwesomeIcon className={"mr-2"} icon={faRedo}/>
                Alles Zurücksetzen
            </button>
            {showModal &&
            <Modal closeModal={() => setShowModal(false)}>
                <div className={"text-center font-bold"}>
                    Es werden alle Würfe und Spieler gelöscht. Sicher?
                </div>
                <button
                    className={"w-full mt-4 rounded-xl bg-white shadow-md py-3 text-blue-600 text-center bg-gray-100"}
                    onClick={() => setShowModal(false)}
                >
                    <FontAwesomeIcon className={"mr-2"} icon={faBowlingBall}/>
                    Weiterspielen
                </button>
                <button
                    className={"w-full mt-4 rounded-xl bg-white shadow-md py-3 text-red-600 text-center bg-red-100"}
                    onClick={() =>{
                        setShowModal(false)
                        reset()
                    }}
                >
                    <FontAwesomeIcon className={"mr-2"} icon={faTrashAlt}/>
                    Alles Löschen
                </button>
            </Modal>
            }
        </div>
    )
}

function Team({team, setTeam, deleteTeam, actionCount, ...props}) {
    return (
        <div>
            <div className={`w-100 rounded-xl bg-${team.color}-100 dark:bg-${team.color}-900 dark:bg-opacity-70 shadow-md p-3`}>
                <ColorSelector
                    className={"float-right mb-2"}
                    color={team.color}
                    setColor={color => {
                        setTeam({...team, color: color})
                    }}
                />
                <div className={"space-y-3 mb-2"}>
                    {team.players.map((player, i) => {
                        return <Player
                            player={player}
                            throwCount={actionCount[player.id]}
                            color={team.color}
                            setPlayer={(_player) => {
                                team.players[i] = _player
                                setTeam({...team})
                            }}
                            deletePlayer={() => {
                                if (actionCount[player.id] > 0) return
                                team.players.splice(i, 1)
                                if (team.players.length === 0) {
                                    deleteTeam()
                                    return
                                }
                                setTeam({...team})
                            }}
                            key={player.id}
                            inputId={player.id}
                        />
                    })}
                </div>
                <div>
                    <GroupButton
                        color={"blue"}
                        onClick={() => {
                            const _player = newPlayer("")
                            team.players.push(_player)
                            setTeam({...team})
                            setTimeout(()=> {
                                try {
                                    document.getElementById(_player.id).focus()
                                } catch (e) {}

                            },0)
                        }}
                    >
                        <FontAwesomeIcon className={"mr-2"} icon={faPlus}/>
                        Neuer Spieler
                    </GroupButton>
                </div>
            </div>
        </div>
    )
}

function GroupButton({onClick, className="", color="blue", ...props}) {
    return (
        <button
            className={`
            first:rounded-t-xl last:rounded-b-xl border-b last:border-b-0 w-full px-3 py-2 transition shadow-sm 
            bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-100 text-${color}-600 dark:text-gray-300
            dark:bg-opacity-30 dark:border-opacity-40
            ` + className}
            onClick={onClick}
        >
            {props.children}
        </button>
    )
}

function Player({player, setPlayer, deletePlayer, color, throwCount, ...props}) {
    return (
        <div className={"flex"}>
            <button onClick={() => deletePlayer()}>
                <FontAwesomeIcon
                    className={throwCount > 0 ?
                        `text-gray-400 dark:text-${color}-900` :
                        `text-${color}-600 dark:text-white`}
                    icon={faTrashAlt}
                />
            </button>
            <input
                className={`appearance-none border w-full py-1 px-0 ml-3 leading-tight
                focus:outline-none focus:shadow-outline 
                focus:border-${color}-800 dark:focus:border-${color}-200
                rounded-none border-b-2 border-l-0 border-r-0 border-t-0 bg-transparent
                mr-2 border-${color}-200 text-${color}-600 dark:border-${color}-500 dark:text-white
                `}
                id={props.inputId}
                type="text"
                placeholder="Name"
                value={player.name}
                onChange={event => setPlayer({...player, name: event.target.value})}
            />
        </div>
    )
}

const colors = ["red", "blue", "green", "purple", "yellow", "pink"]

function ColorSelector({color, setColor, ...props}) {
    const [editing, setEditing] = useState(false)

    return (
        <button className={props.className}>
            <div
                className={`rounded-full w-10 h-10 bg-${color}-500 dark:bg-${color}-600 text-center py-2`}
                onClick={() => setEditing(!editing)}>
                <FontAwesomeIcon className={"text-white"} icon={faPen}/>
            </div>
            {editing &&
                <Modal closeModal={() => setEditing(false)}>
                    <h2 className={"font-bold mb-6 text-center"}>Farbe Auswählen</h2>
                    <div className={"grid grid-cols-3 gap-4 place-items-center"}>
                        {colors.map(c => {
                            return <div
                                className={`rounded-full shadow-md w-14 h-14 bg-${c}-500 text-center py-2`}
                                key={c}
                                onClick={() => {
                                    setEditing(false)
                                    setColor(c)
                                }}
                            />
                        })}
                    </div>
                </Modal>
            }
        </button>
    )
}

function Modal({closeModal, children}) {
    return (
        <div
            id={"modal"}
            className="fixed inset-0 bg-gray-600 bg-opacity-20 backdrop-filter backdrop-blur overflow-y-auto
            h-screen w-full z-30 flex"
            onClick={(e) => {
                if (e.target.id === 'modal') {
                    closeModal()
                }
            }}
        >
            <div className={"rounded-2xl bg-white dark:bg-gray-900 dark:text-gray-200 shadow-lg my-auto mx-5 w-full p-4"}>
                {children}
            </div>
        </div>
    )
}