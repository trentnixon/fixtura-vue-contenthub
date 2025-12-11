export const useGlobalComposable = () => {
  function getDisplayName(type) {
    const names = {
      CricketResults: "Weekend Results",
      CricketLadder: "Ladder",
      CricketTop5Bowling: "Top 5 Bowling",
      CricketTop5Batting: "Top 5 Batting",
      CricketBattingPerformances: "Batting Performances",
      CricketBowlingPerformances: "Bowling Performances",
      CricketUpcoming: "Upcoming Fixtures",
      CricketResultSingle: "Single Game Result",
      CricketRoster: "Roster Poster",
    };
    return names[type] || type;
  }

  return {
    getDisplayName,
  };
};
