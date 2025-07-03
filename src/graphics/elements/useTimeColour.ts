interface ColourSwatch {
    plasticTop: string;
    plasticBottom: string;
    textOutline: string;
    trace: string;
    traceOutline: string;
    chip: string;
}

const dayTimeColours: ColourSwatch = {
    plasticTop: "#4A85DE",
    plasticBottom: "#437c90",
    textOutline: "#CC7722",
    trace: "#A0F5FF",
    traceOutline: "#113C63",
    chip: "#8CA7FE",
};

const sunsetTimeColours: ColourSwatch = {
    plasticTop: "#ffa178",
    plasticBottom: "#ffbf7e",
    textOutline: "#8574b8",
    trace: "#ffd3a0",
    traceOutline: "#83180a",
    chip: "#f2aeae",
};

const nightTimeColours: ColourSwatch = {
    plasticTop: "#c5a0f2",
    plasticBottom: "#f79fff",
    textOutline: "#cc7722",
    trace: "#cca0ff",
    traceOutline: "#483a72",
    chip: "#918da9",
};

const sunriseTimeColours: ColourSwatch = {
    plasticTop: "#2b2b2b",
    plasticBottom: "#202020",
    textOutline: "#309128",
    trace: "#d7ffa0",
    traceOutline: "#011d03",
    chip: "#918da9",
};

export const useTimeColour = (time: Date): ColourSwatch => {
    const hours = time.getHours();
    if (hours >= 6 && hours < 12) {
        return dayTimeColours;
    } else if (hours >= 12 && hours < 18) {
        return sunsetTimeColours;
    } else if (hours >= 18 && hours < 24) {
        return nightTimeColours;
    } else {
        return sunriseTimeColours;
    }
};
