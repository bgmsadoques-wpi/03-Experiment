
class TreeMap extends Chart
{
    // example: https://www.d3-graph-gallery.com/graph/treemap_json.html

    constructor(svg, width, height)
    {
        super(svg, width, height);
        this.data = {children: []};
        this.type = "TreeMap";
    }

    newRandom()
    {
        super.newRandom();

        this.data = {children: []};

        // random integers 10-90
        let random = d3.randomInt(10, 91);
        for (let i = 0; i < this.features.length; i++)
        {
            this.data.children.push({value: random()});
        }
    }

    make()
    {
        // Here the size of each leave is given in the 'value' field in input data
        var root = d3.hierarchy(this.data).sum(function(d){return d.value})

        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([this.width, this.height])
            .padding(5)
            (root)

        // use this information to add rectangles:
        this.svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("fill", "white");

        // Get the leaves that are our points of interest
        let circles = [root.leaves()[this.pointsOfInterest[0]], root.leaves()[this.pointsOfInterest[1]]];

        // Mark those leaves with our standard circles
        this.svg.selectAll("circle")
            .data(circles)
            .enter()
            .append("circle")
            .attr('cx', function (d) { return d.x0 + 0.5*(d.x1 - d.x0); })
            .attr('cy', function (d) { return d.y0 + 0.5*(d.y1 - d.y0);; })
            .attr('r', 10)
            .style("fill", "black");

        // TODO: how to make the chart work?

        this.answer = 0;
    }

    check(answer)
    {

    }
}