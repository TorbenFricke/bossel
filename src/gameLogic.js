import {uid} from "./util";

export const actions = {
    throw: 0,
    skip: 1,
}

export function initialGameState() {
    let teams = [
        {
            throws: 0,
            color: "red",
            id: uid(),
            players: [
                newPlayer(""),
            ]
        },
        {
            throws: 0,
            color: "blue",
            id: uid(),
            players: [
                newPlayer(""),
            ]
        },
    ]
    // timeline format
    // {playerId: "njadhzs", action: actions.throw, teamId: "kijhzg"},
    return {teams: teams, timeline: []}
}

export function newPlayer(name) {
    return {name: name, throws: 0, id: uid()}
}

export function newTeam(name) {
    return {color: "yellow", throws: 0, id: uid(), players: [newPlayer(name)]}
}

export function findPlayerById(teams, id) {
    for (const team of teams) {
        for (const player of team.players) {
            if (player.id === id) return player
        }
    }
    return {}
}

export function findTeamById(teams, id) {
    for (const team of teams) {
        if (team.id === id) return team
    }
    return {}
}

export function findTeamByPlayerId(teams, id) {
    for (const team of teams) {
        for (const player of team.players) {
            if (player.id === id) return team
        }
    }
    return {}
}

export function findThrowOrder(teams, timeline) {
    function lastPlayerIdInTeam(teamId) {
        for (let entry of timeline.slice().reverse()) {
            if (entry.teamId === teamId) return entry.playerId
        }
        return findTeamById(teams, teamId).players[0].id
    }

    let byTeam = {}
    for (const team of teams) {
        if (team.players.length === 0) continue
        const lastThrowerId = lastPlayerIdInTeam(team.id)
        let lastThrowerIndex = team.players.findIndex(player => player.id === lastThrowerId)
        lastThrowerIndex = (lastThrowerIndex + 1) % team.players.length
        byTeam[team.id] = [...team.players.slice(lastThrowerIndex), ...team.players.slice(0, lastThrowerIndex)]
    }

    // sort teams
    let teamsLastThrow = {}
    for (let i = timeline.length - 1; i >= 0; i--) {
        if (!(timeline[i].teamId in teamsLastThrow)) teamsLastThrow[timeline[i].teamId] = i
        if (Object.keys(teamsLastThrow).length === teams.length) break
    }

    for (let team of teams) {
        if (team.id in teamsLastThrow) continue
        teamsLastThrow[team.id] = -1
    }

    const sorted = Object.keys(teamsLastThrow)
        .map(key => {
            return {id: key, lastIdx: teamsLastThrow[key]}
        })
        .sort((a, b) => {
            return a.lastIdx < b.lastIdx ? -1 : a.lastIdx === b.lastIdx ? 0 : 1
        })

    const byTeamList = []
    for (let item of sorted) {
        byTeamList.push(byTeam[item.id])
    }

    let order = []
    for (let i = 0; i < 20; i++) {
        for (const teamOrder of byTeamList) {
            if (!teamOrder) { continue }
            i < teamOrder.length && order.push(teamOrder[i])
        }
    }

    return order
}

export function generateTimelineEntry(teams, playerId, action, teamId=null) {
    return {
        playerId: playerId,
        action: action,
        teamId: teamId ? teamId : findTeamByPlayerId(teams, playerId).id,
        timestamp: Date.now(),
    }
}

export function saveToLocalstorage({teams, timeline}) {
    if (teams) {
        localStorage.setItem("teams", JSON.stringify(teams))
    }
    if (timeline) {
        localStorage.setItem("timeline", JSON.stringify(timeline))
    }
}