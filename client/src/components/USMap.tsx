import { useState } from "react";
import { useLocation } from "wouter";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

interface USMapProps {
  stateData?: Record<string, { notices: number; workers: number }>;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const stateAbbreviations: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
  "District of Columbia": "DC", "Puerto Rico": "PR",
};

export default function USMap({ stateData = {} }: USMapProps) {
  const [, setLocation] = useLocation();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<{ name: string; code: string; x: number; y: number } | null>(null);

  const handleStateClick = (stateCode: string) => {
    if (stateCode && stateCode !== "DC" && stateCode !== "PR") {
      setLocation(`/state/${stateCode}`);
    }
  };

  const getStateFill = (stateCode: string) => {
    const data = stateData[stateCode];
    if (!data || data.notices === 0) return "hsl(var(--muted))";
    
    if (data.notices >= 20) return "hsl(var(--destructive))";
    if (data.notices >= 10) return "hsl(0 60% 45%)";
    if (data.notices >= 5) return "hsl(25 75% 50%)";
    return "hsl(45 90% 55%)";
  };

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-auto"
        data-testid="map-interactive-us"
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => {
              const stateName = geo.properties.name;
              const stateCode = stateAbbreviations[stateName] || "";
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getStateFill(stateCode)}
                  stroke="hsl(var(--background))"
                  strokeWidth={0.75}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: getStateFill(stateCode),
                      filter: "brightness(1.15)",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={(evt: any) => {
                    setHoveredState(stateCode);
                    const rect = evt.currentTarget.getBoundingClientRect();
                    setTooltipContent({
                      name: stateName,
                      code: stateCode,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredState(null);
                    setTooltipContent(null);
                  }}
                  onClick={() => handleStateClick(stateCode)}
                  data-testid={`map-state-${stateCode}`}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltipContent && hoveredState && (
        <div
          className="fixed z-50 px-4 py-3 rounded-md shadow-lg pointer-events-none bg-popover border border-border"
          style={{
            left: tooltipContent.x,
            top: tooltipContent.y - 10,
            transform: "translate(-50%, -100%)",
          }}
          data-testid="map-tooltip"
        >
          <div className="font-semibold text-popover-foreground">
            {tooltipContent.name}
          </div>
          {stateData[hoveredState] && (
            <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
              <div className="font-mono">
                {stateData[hoveredState].notices} notices
              </div>
              <div className="font-mono">
                {stateData[hoveredState].workers.toLocaleString()} workers affected
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(var(--muted))" }} />
          <span className="text-muted-foreground">No data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(45 90% 55%)" }} />
          <span className="text-muted-foreground">1-4 notices</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(25 75% 50%)" }} />
          <span className="text-muted-foreground">5-9 notices</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(0 60% 45%)" }} />
          <span className="text-muted-foreground">10-19 notices</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(var(--destructive))" }} />
          <span className="text-muted-foreground">20+ notices</span>
        </div>
      </div>
    </div>
  );
}
