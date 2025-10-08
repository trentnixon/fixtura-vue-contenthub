import { computed } from "vue";

interface GameData {
  id: number;
  gameId: string;
  imageUrl: string;
  teams: string;
  scores: string;
  structuredOutput: {
    team1: string;
    team2: string;
    score1: string;
    score2: string;
    title: string;
    subtitle: string;
    highlights: string;
    article_body: string;
    winner: string;
    twitter_post: string;
    match_identifier: string;
    social_media_post: string;
  };
}

export function useGameDataFromImages(
  formattedAssets: any[],
  formattedArticles: any[]
) {
  // Extract game data from image filenames
  const gameDataFromImages = computed(() => {
    const downloads = formattedAssets[0]?.downloads || [];

    return downloads.map((imageUrl: string, index: number) => {
      // Extract game ID from filename
      // Pattern: CricketResultSingle_First_Grade__Belvidere_Cup__195_26b68f59848c.png
      const gameIdMatch = imageUrl.match(/_(\d+)_[a-f0-9]+\.png$/);
      const gameId = gameIdMatch ? gameIdMatch[1] : `game-${index}`;

      return {
        id: index,
        gameId: gameId,
        imageUrl: imageUrl,
        // TODO: We need to find where the real team/scores data is stored
        teams: `Game ${gameId} - Need real data`,
        scores: `Need real scores`,
        // Create a structured output similar to the existing article format
        structuredOutput: {
          team1: `Real team data needed`,
          team2: `Real team data needed`,
          score1: "Real score needed",
          score2: "Real score needed",
          title: `Game ${gameId} - Need real data`,
          subtitle: `Game ${gameId} - Need real data`,
          highlights: `Game ${gameId} - Need real data`,
          article_body: `Game ${gameId} - Need real data`,
          winner: "Real winner needed",
          twitter_post: `Game ${gameId} - Need real data`,
          match_identifier: `Game ${gameId} - Need real data`,
          social_media_post: `Game ${gameId} - Need real data`,
        },
      };
    });
  });

  // Merge with existing articles if available
  const mergedGameData = computed(() => {
    const existingArticles = formattedArticles || [];
    const imageGameData = gameDataFromImages.value;

    // If we have existing articles, use them first, then fill gaps with image data
    return imageGameData.map((imageGame: GameData, index: number) => {
      const existingArticle = existingArticles[index];

      if (existingArticle && existingArticle.structuredOutput) {
        // Use existing article data
        return {
          ...imageGame,
          structuredOutput: existingArticle.structuredOutput,
          teams:
            existingArticle.structuredOutput.team1 &&
            existingArticle.structuredOutput.team2
              ? `${existingArticle.structuredOutput.team1} vs ${existingArticle.structuredOutput.team2}`
              : imageGame.teams,
          scores:
            existingArticle.structuredOutput.score1 &&
            existingArticle.structuredOutput.score2
              ? `${existingArticle.structuredOutput.score1} | ${existingArticle.structuredOutput.score2}`
              : imageGame.scores,
        };
      }

      // Use generated data from image
      return imageGame;
    });
  });

  return {
    gameDataFromImages,
    mergedGameData,
  };
}
