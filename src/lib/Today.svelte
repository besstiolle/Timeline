<script lang="ts">

    export let start: Date;
    export let end: Date;

    const maxWidth = 1000 - 150
    const todayColor = "#D41E24"
    const todayLabelColor = "#000000"
    
    let widthToday = (new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime()) * maxWidth
    let xTodayPosition =  widthToday + 150
</script>

    
<defs>
    <g id="today">
        <rect x="0" y="20" width="{widthToday}" height="5" style="fill: {todayColor}"/>
        <polygon points='{xTodayPosition},25 {xTodayPosition + 5},40 {xTodayPosition - 5},40' style='fill: {todayColor}' />
        <text x="{xTodayPosition - 10}" y="50" font-family="Verdana" font-size="7" fill="{todayLabelColor}">Today</text>
        <line stroke-dasharray="0.5 2" x1="{xTodayPosition}" y1="40" x2="{xTodayPosition}" y2="100%" stroke="{todayColor}" />
    </g>
</defs>

<use x="150" y="50" href="#today"/>
