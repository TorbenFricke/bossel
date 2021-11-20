import {uid} from "./util";

export const actions = {
    throw: 0,
    skip: 1,
}

export function initialGameState() {
    return {teams: [newTeam("red"), newTeam("blue")], timeline: []}
}

export function newPlayer(name) {
    return {name: name, id: uid()}
}

export function newTeam(color="yellow") {
    return {color: color, id: uid(), players: [newPlayer()]}
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

export function countThrows(timeline) {
    // default value of 0
    let throws = new Proxy({}, {
        get: (target, name) => name in target ? target[name] : 0
    })

    for (let entry of timeline) {
        if (entry.action !== actions.throw) continue
        throws[entry.playerId] += 1
        throws[entry.teamId] += 1
    }

    return throws
}