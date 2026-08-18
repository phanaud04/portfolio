// Feature usage pie chart — reflects a 30-response multi-select survey
// (mentions, not exclusive shares).

type Slice = {
    id: string
    label: string
    value: number
    color: string
    showInSlice: boolean
}

type Props = {
    trafficMapColor?: string
    ferriesColor?: string
    mountainPassesColor?: string
    favoritesColor?: string
    bridgeAlertsColor?: string
    borderWaitsColor?: string
    tollRatesColor?: string
    amtrakColor?: string
    myRouteColor?: string
    sliceLabelColor?: string
    sliceLabelFontSize?: number
    legendTextColor?: string
    legendFontSize?: number
    showLegend?: boolean
    fontFamily?: string
}

export default function FeatureUsagePieChart({
    trafficMapColor = "#2a78d6",
    ferriesColor = "#1baf7a",
    mountainPassesColor = "#eda100",
    favoritesColor = "#008300",
    bridgeAlertsColor = "#4a3aa7",
    borderWaitsColor = "#e34948",
    tollRatesColor = "#e87ba4",
    amtrakColor = "#eb6834",
    myRouteColor = "#999999",
    sliceLabelColor = "#ffffff",
    sliceLabelFontSize = 13,
    legendTextColor = "#333333",
    legendFontSize = 12,
    showLegend = true,
    fontFamily = "var(--font-sans)",
}: Props) {
    const data: Slice[] = [
        {
            id: "traffic",
            label: "Traffic Map",
            value: 24,
            color: trafficMapColor,
            showInSlice: true,
        },
        {
            id: "ferries",
            label: "Ferries",
            value: 18,
            color: ferriesColor,
            showInSlice: true,
        },
        {
            id: "mountain",
            label: "Mountain Passes",
            value: 17,
            color: mountainPassesColor,
            showInSlice: true,
        },
        {
            id: "favorites",
            label: "Favorites",
            value: 5,
            color: favoritesColor,
            showInSlice: false,
        },
        {
            id: "bridge",
            label: "Bridge Alerts",
            value: 5,
            color: bridgeAlertsColor,
            showInSlice: false,
        },
        {
            id: "border",
            label: "Border Waits",
            value: 4,
            color: borderWaitsColor,
            showInSlice: false,
        },
        {
            id: "toll",
            label: "Toll Rates",
            value: 3,
            color: tollRatesColor,
            showInSlice: false,
        },
        {
            id: "amtrak",
            label: "Amtrak Cascades",
            value: 3,
            color: amtrakColor,
            showInSlice: false,
        },
        {
            id: "route",
            label: "My Route",
            value: 2,
            color: myRouteColor,
            showInSlice: false,
        },
    ]

    const total = data.reduce((sum, d) => sum + d.value, 0)

    const size = 320
    const radius = size / 2
    const cx = radius
    const cy = radius

    let cumulativeAngle = -90 // start at 12 o'clock

    const slices = data.map((d) => {
        const angle = (d.value / total) * 360
        const startAngle = cumulativeAngle
        const endAngle = cumulativeAngle + angle
        cumulativeAngle = endAngle

        const startRad = (startAngle * Math.PI) / 180
        const endRad = (endAngle * Math.PI) / 180

        const x1 = cx + radius * Math.cos(startRad)
        const y1 = cy + radius * Math.sin(startRad)
        const x2 = cx + radius * Math.cos(endRad)
        const y2 = cy + radius * Math.sin(endRad)

        const largeArc = angle > 180 ? 1 : 0
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

        const midAngle = (startAngle + endAngle) / 2
        const midRad = (midAngle * Math.PI) / 180
        const labelRadius = radius * 0.65
        const labelX = cx + labelRadius * Math.cos(midRad)
        const labelY = cy + labelRadius * Math.sin(midRad)

        const percentage = Math.round((d.value / total) * 100)

        return { ...d, path, labelX, labelY, percentage }
    })

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                fontFamily,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                role="img"
                aria-label="Pie chart of feature usage mentions"
            >
                {slices.map((s) => (
                    <path
                        key={s.id}
                        d={s.path}
                        fill={s.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                    />
                ))}
                {slices
                    .filter((s) => s.showInSlice)
                    .map((s) => (
                        <text
                            key={`label-${s.id}`}
                            x={s.labelX}
                            y={s.labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={sliceLabelColor}
                            fontFamily={fontFamily}
                            fontWeight={500}
                        >
                            <tspan
                                x={s.labelX}
                                dy="-0.3em"
                                fontSize={sliceLabelFontSize}
                            >
                                {s.label}
                            </tspan>
                            <tspan
                                x={s.labelX}
                                dy="1.2em"
                                fontSize={sliceLabelFontSize}
                            >
                                {s.percentage}%
                            </tspan>
                        </text>
                    ))}
            </svg>

            {showLegend && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "8px 16px",
                        marginTop: 16,
                        fontFamily,
                    }}
                >
                    {data.map((d) => (
                        <div
                            key={d.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: legendFontSize,
                                color: legendTextColor,
                            }}
                        >
                            <span
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 2,
                                    background: d.color,
                                    display: "inline-block",
                                    flexShrink: 0,
                                }}
                            />
                            {d.label} ({Math.round((d.value / total) * 100)}%)
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
