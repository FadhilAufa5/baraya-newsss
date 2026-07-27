export interface TrafficPoint {
    day: string;
    visits: number;
    pageviews: number;
}

export function AreaChart({ data }: { data: TrafficPoint[] }) {
    const W = 700;
    const H = 180;
    const PL = 0;
    const PR = 0;
    const PT = 10;
    const PB = 30;

    const visits = data.map((d) => d.visits);
    const pageviews = data.map((d) => d.pageviews);
    const maxVal = Math.max(...pageviews, 10) * 1.1;

    const xPos = (i: number) => PL + (i / (data.length - 1 || 1)) * (W - PL - PR);
    const yPos = (v: number) => PT + (1 - v / maxVal) * (H - PT - PB);

    const toPath = (vals: number[]) =>
        vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(' ');

    const toArea = (vals: number[]) => {
        const line = toPath(vals);
        const lastX = xPos(vals.length - 1).toFixed(1);
        const baseY = (H - PB).toFixed(1);
        return `${line} L${lastX},${baseY} L${PL},${baseY} Z`;
    };

    const pvPath = toPath(pageviews);
    const visPath = toPath(visits);
    const pvArea = toArea(pageviews);
    const visArea = toArea(visits);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Traffic chart">
            <defs>
                <linearGradient id="grad-pv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grad-vis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((f) => (
                <line
                    key={f}
                    x1={PL}
                    y1={yPos(maxVal * f).toFixed(1)}
                    x2={W - PR}
                    y2={yPos(maxVal * f).toFixed(1)}
                    stroke="currentColor"
                    strokeOpacity="0.06"
                    strokeWidth="1"
                />
            ))}

            {/* Area fills */}
            <path d={pvArea} fill="url(#grad-pv)" />
            <path d={visArea} fill="url(#grad-vis)" />

            {/* Lines */}
            <path d={pvPath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={visPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots + labels */}
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={xPos(i).toFixed(1)} cy={yPos(d.pageviews).toFixed(1)} r={data.length > 20 ? '2' : '3.5'} fill="#8b5cf6" />
                    <circle cx={xPos(i).toFixed(1)} cy={yPos(d.visits).toFixed(1)} r={data.length > 20 ? '2' : '3.5'} fill="#3b82f6" />
                    {d.day ? (
                        <text
                            x={xPos(i).toFixed(1)}
                            y={H - 6}
                            textAnchor="middle"
                            fontSize="11"
                            fill="currentColor"
                            opacity="0.5"
                        >
                            {d.day}
                        </text>
                    ) : null}
                </g>
            ))}
        </svg>
    );
}
