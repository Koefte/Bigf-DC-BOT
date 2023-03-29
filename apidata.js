

async function getSummonerData(region,username,apiKey) {
    
  const summonerDataResponse = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`);
  const summonerData = await summonerDataResponse.json();
  
  const rankedDataResponse = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${apiKey}`);
  const rankedData = await rankedDataResponse.json();

  
  const soloDuoData = rankedData.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
  const winrate = (soloDuoData.wins / (soloDuoData.wins + soloDuoData.losses) * 100).toFixed(2);
  
  return {
    summonerName: summonerData.name,
    rank: soloDuoData.tier + ' ' + soloDuoData.rank,
    lp: soloDuoData.leaguePoints,
    winrate: winrate + '%'
  };
}

module.exports = {
    getSummonerData,
    getMostPlayedChampion,
    getChampionName,
  };



async function getMostPlayedChampion(region,username,apiKey) {
    
    const summonerDataResponse = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`);
    const summonerData = await summonerDataResponse.json();
    const summonerId = summonerData.id;
    

    const mostPlayedChampionDataResponse = await fetch(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${apiKey}`);
    const mostPlayedChampionData = await mostPlayedChampionDataResponse.json();
    
  
    return getChampionName(mostPlayedChampionData[0].championId)
  }

  async function getChampionName(champid) {
    const versionsResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await versionsResponse.json();
    const latestVersion = versions[0];
    
    const championDataResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
    const championData = await championDataResponse.json();
    const championList = championData.data;
    
    function getChampionInfo(id) {
      for (const key in championList) {
        if (championList[key].key === id.toString()) {
          return championList[key];
        }
      }
      return null;
    }
    
    // Example usage:
    const championInfo = getChampionInfo(champid);
    return championInfo.name
}


