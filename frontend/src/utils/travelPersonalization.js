export function personalizeHotels(
  hotels,
  style
) {

  if (!hotels) return [];

  const sorted = [...hotels];

  switch (style) {

    case "Luxury":

      return sorted.sort(
        (a, b) => b.price - a.price
      );

    case "Backpacker":

      return sorted.sort(
        (a, b) => a.price - b.price
      );

    case "Adventure":

      return sorted.sort((a, b) => {

        const aAdventure =
          a.vibeTags?.includes(
            "Adventure"
          );

        const bAdventure =
          b.vibeTags?.includes(
            "Adventure"
          );

        return bAdventure - aAdventure;
      });

    case "Couple":

      return sorted.sort((a, b) => {

        const aRomantic =
          a.vibeTags?.includes(
            "Luxury"
          );

        const bRomantic =
          b.vibeTags?.includes(
            "Luxury"
          );

        return bRomantic - aRomantic;
      });

    default:
      return sorted;
  }
}


export function personalizeItinerary(
  itinerary,
  style
) {

  if (!itinerary) return [];

  return itinerary.map((day) => {

    let aiNote = "";

    switch (style) {

      case "Luxury":

        aiNote =
          "✨ Premium experiences and slower-paced comfort recommended.";

        break;

      case "Adventure":

        aiNote =
          "⛰ Packed with outdoor exploration and energetic activities.";

        break;

      case "Relaxed":

        aiNote =
          "🌴 Relaxed pacing with scenic experiences and recovery time.";

        break;

      case "Couple":

        aiNote =
          "❤️ Romantic experiences and sunset-friendly moments added.";

        break;

      case "Nightlife":

        aiNote =
          "🌃 Evening entertainment and nightlife experiences prioritized.";

        break;

      case "Backpacker":

        aiNote =
          "🎒 Budget-friendly local exploration optimized.";

        break;

      default:

        aiNote =
          "✈ AI optimized experience.";
    }

    return {
      ...day,
      aiNote,
    };
  });
}