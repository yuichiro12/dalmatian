var EdgePath = null;
var Start;
var End;
var NodeDefaultRadius = 7;
var NodeDefaultColor = '#009dec';
var EdgeDefaultColor = 'black';
var ArrowTopDefaultWidth = 4;
var ArrowTopDefaultHeight = 11;
var ArrowTopDefaultColor = 'black';
var Nodes = [];
// var Edges = [];

function Node (point, radius, pathInfo) {
    this.leavingEdges = [];
    this.enteringEdges = [];
    this.point = point;
    this.radius = radius;
    this.path = pathInfo;
    return this
}

function Edge (tail, head, pathInfo) {
    // from
    this.tail = tail;
    // to
    this.head = head;
    this.pathInfo = pathInfo;
    return this
}

function onMouseDown(event) {
    var node = OnNode(event.point);
    if (node) {
        Start = node.point;
        EdgePath = new Path();
        EdgePath.strokeColor = EdgeDefaultColor;
        EdgePath.add(Start);
    } else {
        node = newNode(event.point);
        Nodes.push(node);
    }
}

function OnNode(point) {
    return Nodes.find(function(node) {
        return point.isClose(node.point, node.radius);
    });
}

function OnSameNodes(point1, point2) {
    return Nodes.find(function(node) {
        return point1.isClose(node.point, node.radius) && point2.isClose(node.point, node.radius);
    });
}

function onMouseUp(event) {
    var node = OnNode(event.point);
    if (node && EdgePath && !OnSameNodes(Start, event.point)) {
        End = node.point;
        newEdge(Start, End);
    }
    EdgePath = null;
}

function newNode(point) {
    var nodePath = new Path.Circle({
        center: point,
        radius: NodeDefaultRadius,
        fillColor: NodeDefaultColor
    });
    var node = new Node(point, NodeDefaultRadius, nodePath)
    return node;
}

function newEdge(start, end) {
    EdgePath.add(end);
    EdgePath.sendToBack();
    var arrowTopBasePoint = (end - (end - start).normalize(NodeDefaultRadius + ArrowTopDefaultHeight - 2));
    var arrowTop = newArrowTop(arrowTopBasePoint);
    arrowTop.sendToBack();
    arrowTop.insertAbove(EdgePath);
}

function newArrowTop(point) {
    var path = new Path({
        segments: [point + [0, -ArrowTopDefaultWidth], point + [0, ArrowTopDefaultWidth], point + [ArrowTopDefaultHeight, 0]],
        fillColor: ArrowTopDefaultColor,
        closed: true
    });
    path.rotate(getRotateAngleForArrowTop(Start, End), point);
    return path;
}

function getRotateAngleForArrowTop(start, end) {
    return (end - start).angle;
}
