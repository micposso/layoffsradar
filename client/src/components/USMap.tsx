import { useState } from "react";
import { useLocation } from "wouter";

interface USMapProps {
  stateData?: Record<string, { notices: number; workers: number }>;
}

const stateCoordinates: Record<string, { path: string; name: string }> = {
  AL: { path: "M772,398 L776,420 L790,418 L795,432 L785,438 L780,450 L760,448 L758,432 L745,428 L748,410 L765,398 Z", name: "Alabama" },
  AK: { path: "M100,500 L150,480 L180,490 L200,510 L180,530 L140,540 L100,520 Z", name: "Alaska" },
  AZ: { path: "M210,350 L215,420 L180,425 L175,355 L210,350 Z", name: "Arizona" },
  AR: { path: "M640,360 L680,358 L682,395 L685,410 L665,412 L638,408 L635,385 Z", name: "Arkansas" },
  CA: { path: "M140,200 L145,280 L150,340 L130,350 L115,330 L100,260 L105,220 L125,195 Z", name: "California" },
  CO: { path: "M340,270 L450,268 L448,340 L338,342 Z", name: "Colorado" },
  CT: { path: "M890,220 L900,220 L902,235 L892,236 Z", name: "Connecticut" },
  DE: { path: "M870,265 L875,265 L876,280 L871,280 Z", name: "Delaware" },
  FL: { path: "M810,445 L825,455 L835,475 L825,490 L805,485 L795,470 L785,450 L790,445 Z", name: "Florida" },
  GA: { path: "M775,380 L790,378 L795,410 L785,425 L765,420 L760,395 Z", name: "Georgia" },
  HI: { path: "M280,520 L295,518 L310,525 L305,535 L290,537 L275,530 Z", name: "Hawaii" },
  ID: { path: "M230,120 L250,115 L260,180 L245,200 L230,195 Z", name: "Idaho" },
  IL: { path: "M680,260 L690,258 L695,320 L685,340 L670,338 L665,275 Z", name: "Illinois" },
  IN: { path: "M715,265 L730,263 L732,325 L720,327 L710,310 Z", name: "Indiana" },
  IA: { path: "M620,235 L680,232 L682,275 L620,278 Z", name: "Iowa" },
  KS: { path: "M540,305 L650,302 L648,350 L538,352 Z", name: "Kansas" },
  KY: { path: "M730,310 L790,305 L792,330 L750,335 L735,325 Z", name: "Kentucky" },
  LA: { path: "M640,420 L685,418 L690,445 L670,450 L645,445 Z", name: "Louisiana" },
  ME: { path: "M910,120 L920,110 L930,130 L925,160 L915,165 L905,145 Z", name: "Maine" },
  MD: { path: "M850,270 L870,268 L872,285 L852,287 Z", name: "Maryland" },
  MA: { path: "M895,210 L920,208 L922,220 L897,222 Z", name: "Massachusetts" },
  MI: { path: "M720,210 L740,205 L755,235 L745,255 L725,250 Z", name: "Michigan" },
  MN: { path: "M580,150 L640,148 L642,220 L580,222 Z", name: "Minnesota" },
  MS: { path: "M690,385 L705,383 L708,430 L692,432 Z", name: "Mississippi" },
  MO: { path: "M620,285 L685,282 L688,340 L625,343 Z", name: "Missouri" },
  MT: { path: "M300,120 L450,115 L448,195 L298,200 Z", name: "Montana" },
  NE: { path: "M480,250 L640,247 L638,305 L478,308 Z", name: "Nebraska" },
  NV: { path: "M160,200 L175,270 L155,330 L140,325 L130,260 L145,200 Z", name: "Nevada" },
  NH: { path: "M905,165 L915,160 L920,190 L910,195 Z", name: "New Hampshire" },
  NJ: { path: "M875,250 L885,248 L888,275 L878,277 Z", name: "New Jersey" },
  NM: { path: "M340,345 L448,342 L445,430 L338,433 Z", name: "New Mexico" },
  NY: { path: "M850,200 L900,195 L905,235 L860,240 Z", name: "New York" },
  NC: { path: "M810,320 L870,315 L875,345 L815,350 Z", name: "North Carolina" },
  ND: { path: "M480,150 L640,147 L642,210 L478,213 Z", name: "North Dakota" },
  OH: { path: "M750,255 L785,252 L788,305 L755,308 Z", name: "Ohio" },
  OK: { path: "M540,355 L650,352 L648,395 L538,398 Z", name: "Oklahoma" },
  OR: { path: "M155,140 L245,135 L243,200 L153,205 Z", name: "Oregon" },
  PA: { path: "M820,240 L875,235 L878,275 L823,280 Z", name: "Pennsylvania" },
  RI: { path: "M900,222 L905,222 L906,230 L901,230 Z", name: "Rhode Island" },
  SC: { path: "M805,350 L825,348 L830,375 L810,377 Z", name: "South Carolina" },
  SD: { path: "M480,215 L640,212 L638,272 L478,275 Z", name: "South Dakota" },
  TN: { path: "M720,330 L820,325 L822,355 L725,360 Z", name: "Tennessee" },
  TX: { path: "M480,400 L540,398 L535,485 L475,490 L465,450 Z", name: "Texas" },
  UT: { path: "M270,240 L340,238 L338,340 L268,342 Z", name: "Utah" },
  VT: { path: "M895,175 L905,172 L908,200 L898,203 Z", name: "Vermont" },
  VA: { path: "M820,285 L875,280 L878,315 L825,320 Z", name: "Virginia" },
  WA: { path: "M190,80 L280,75 L278,135 L188,140 Z", name: "Washington" },
  WV: { path: "M795,280 L820,278 L823,310 L798,312 Z", name: "West Virginia" },
  WI: { path: "M660,180 L710,178 L712,245 L662,247 Z", name: "Wisconsin" },
  WY: { path: "M300,200 L450,197 L448,268 L298,271 Z", name: "Wyoming" },
};

export default function USMap({ stateData = {} }: USMapProps) {
  const [, setLocation] = useLocation();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleStateClick = (stateCode: string) => {
    setLocation(`/state/${stateCode}`);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
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
      <svg
        viewBox="0 0 960 600"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredState(null)}
        data-testid="map-interactive-us"
      >
        {Object.entries(stateCoordinates).map(([code, { path, name }]) => (
          <path
            key={code}
            d={path}
            fill={getStateFill(code)}
            stroke="hsl(var(--background))"
            strokeWidth="2"
            className="transition-all duration-200 cursor-pointer hover-elevate"
            style={{
              filter: hoveredState === code ? "brightness(1.1)" : "none",
            }}
            onMouseEnter={() => setHoveredState(code)}
            onClick={() => handleStateClick(code)}
            data-testid={`map-state-${code}`}
          />
        ))}
      </svg>

      {hoveredState && (
        <div
          className="fixed z-50 px-4 py-3 rounded-md shadow-lg pointer-events-none bg-popover border border-popover-border"
          style={{
            left: mousePosition.x + 15,
            top: mousePosition.y + 15,
          }}
          data-testid="map-tooltip"
        >
          <div className="font-semibold text-popover-foreground">
            {stateCoordinates[hoveredState].name}
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
