export const useGlobalComposable = () => {
  function getDisplayName(type) {
    console.log("[type]", type);
    const names = {
      weekendresults: "Weekend Results",
      ladder: "Ladder",
      top5bowlinglist: "Top 5 Bowling",
      top5battinglist: "Top 5 Batting",
      upcomingfixtures: "Upcoming Fixtures",
      weekendsinglegameresult: "Single Game Result",
      rosterposter: "Roster Poster",
    };
    return names[type] || type;
  }

  return {
    getDisplayName,
  };
};
