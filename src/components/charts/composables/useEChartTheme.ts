import customTheme from "@/theme/echart-theme";

export function useEChartTheme() {
  const getThemeColors = () => {
    // Assuming your customTheme has a color array
    return customTheme.color || [];
  };

  return {
    getThemeColors,
  };
}
