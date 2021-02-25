
class RadarChart extends Chart
{

    constructor(svg, width, height)
    {
        super(svg, width, height);
        this.data = {};
        this.type = "RadarChart";
    }

    newRandom()
    {
        super.newRandom();

        this.data = {};

        // random integers 10-90
        this.features.forEach(p => this.data[p] = d3.randomInt(10, 91)());
    }

    make()
    {
        //
        let radScale = d3.scaleLinear()
            .domain([0,100])
            .range([0,this.width/2 -50]);

        // util
        function angleToCoordinate(angle, value, width, height)
        {
            let x = Math.cos(angle) * radScale(value);
            let y = Math.sin(angle) * radScale(value);
            return {"x": width/2 + x, "y": height/2 - y};
        }

        // cirlce
        this.svg.append("circle")
            .attr("cx", this.width/2)
            .attr("cy", this.height/2)
            .attr("fill", "grey")
            .attr("opacity", 0.5)
            .attr("r", radScale(100));

        this.svg.append("text")
            .attr("x", this.width/2 + 10)
            .attr("y", this.height/2 - radScale(100))
            .text("100");

        // draw path
        let line = d3.line().x(d => d.x).y(d => d.y);

        let coordinates = [];
        for (var i = 0; i < this.features.length; i++)
        {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
            let value = this.data[this.features[i]];
            coordinates.push(angleToCoordinate(angle, value, this.width, this.height));
        }

        this.svg.append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("fill", "grey")

        //draw feature lines
        for (var i = 0; i < this.features.length; i++)
        {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
            let featureLine = angleToCoordinate(angle, 100, this.width, this.height);
            this.svg.append("line")
                .attr("x1", this.width/2)
                .attr("y1", this.height/2)
                .attr("x2", featureLine.x)
                .attr("y2", featureLine.y)
                .attr("stroke","black");

            if((i === this.pointsOfInterest[0]) || (i === this.pointsOfInterest[1]))
            {
                let value = this.data[this.features[i]];
                let point = angleToCoordinate(angle, value, this.width, this.height);
                this.svg.append("circle")
                    .attr("cx", point.x)
                    .attr("cy", point.y)
                    .attr("fill", "black")
                    .attr("r", radScale(3));
            }
        }

        let radarArray = Object.keys(this.data).map(i => this.data[i]);
        let v1 = radarArray[this.pointsOfInterest[0]];
        let v2 = radarArray[this.pointsOfInterest[1]];
        this.calculateAnswer(v1, v2);
    }
}