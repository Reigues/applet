function behavior(point, direction, line) {
    let lineAngle = Math.atan2(line.v.y-line.u.y,line.v.x-line.u.x)
    return {point:point,direction:2*lineAngle-direction}    
}

let scale = 500
let translateX = canvas.width/4
let translateY = 3*canvas.height/4

let context = canvas.getContext("2d")

// set the canvas origin (0,0) to center canvas
// All coordinates to the left of center canvas are negative
// All coordinates below center canvas are negative
context.translate(translateX,translateY);

context.scale(scale,-scale);

let figure=[{x:0,y:0},{x:1/2,y:Math.sqrt(3)/6},{x:0,y:Math.sqrt(3)/3}]
let cursor = {
    x: 0,
    y: 0,
    radius: 20/scale
}
let arrowEnd = {
    arg: 0.713724379, //arctan(sqrt(3)/2)
    r: 100/scale,
    radius: 10/scale
}
let points=new Array(10)
let last_direction=arrowEnd.arg

function getData() {
    return [points[0],arrowEnd.arg]
}


function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

let offset = getCoords(canvas)
offset.top=(-offset.top+translateY)/scale
offset.left=(offset.left+translateX)/scale

let line_colors=["green","red"]

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10/scale; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function draw(highlight_cursor=false, highlight_arrowEnd=false, isCursorModified=false, isArrowEndModified=false) {

    context.clearRect(-translateX, -translateY, canvas.width, canvas.height)
    //context.fillRect(cursor.x,cursor.y,cursor.width,cursor.height)
    context.beginPath();
    context.moveTo(figure[figure.length-1].x,figure[figure.length-1].y)
    for (let i = 0; i < figure.length; i++) {
        context.lineTo(figure[i].x,figure[i].y)
    }
    context.lineWidth = 3/scale;
    context.strokeStyle = 'black';
    context.stroke();
    context.beginPath();
    context.arc(cursor.x, cursor.y, cursor.radius, 0, 2 * Math.PI, false);
    context.fillStyle="black"
    context.fill();
    if (highlight_cursor) {
        context.lineWidth = 3/scale;
        context.strokeStyle = 'blue';
        context.stroke();
    }
    context.beginPath()
    canvas_arrow(context,cursor.x,cursor.y,cursor.x+arrowEnd.r*Math.cos(arrowEnd.arg), cursor.y+arrowEnd.r*Math.sin(arrowEnd.arg))
    context.strokeStyle="black"
    context.stroke()
    if (highlight_arrowEnd) {
        context.beginPath()
        context.arc(cursor.x+arrowEnd.r*Math.cos(arrowEnd.arg), cursor.y+arrowEnd.r*Math.sin(arrowEnd.arg),arrowEnd.radius,0,2*Math.PI)
        context.lineWidth = 3/scale;
        context.strokeStyle = 'blue';
        context.stroke();
    }
    /* let newPoint = nextPoint(cursor,arrowEnd.arg)
    if (newPoint!=null) {
        context.beginPath();
        context.moveTo(newPoint.x, newPoint.y);
        context.lineTo(newPoint.x+1000*Math.cos(newPoint.direction), newPoint.y+1000*Math.sin(newPoint.direction));
        context.strokeStyle = 'green';
        context.stroke();
    } */
    for (let i = 0; i < points.length-1&&points[i]!=null; i++) {
        if (points[i+1]==null) {
            context.beginPath();
            context.moveTo(points[i].x, points[i].y);
            context.lineTo(points[i].x+1000*Math.cos(last_direction), points[i].y+1000*Math.sin(last_direction));
            context.strokeStyle = line_colors[i%2];
            context.stroke();   
        } else {
            context.beginPath();
            context.moveTo(points[i].x, points[i].y);
            context.lineTo(points[i+1].x, points[i+1].y);
            context.strokeStyle = line_colors[i%2];
            context.stroke();
            context.beginPath();
            context.arc(points[i+1].x, points[i+1].y, 5/scale, 0, 2 * Math.PI, false);
            context.fillStyle=line_colors[i%2]
            context.fill();
        }
    }
    context.save();
    context.scale(1, -1);
    if (isCursorModified) {
        context.fillStyle="black"
        context.font = `${30/scale}px Arial`; 
        context.fillText(`X = ${(cursor.x-figure[0].x).toFixed(Math.ceil(parseInt(range_input.value)+Math.log10(scale)))}; Y = ${(figure[0].y-cursor.y).toFixed(Math.ceil(parseInt(range_input.value)+Math.log10(scale)))}`, (10-translateX)/scale, (100-translateY)/scale);
    }
    if (isArrowEndModified) {
        context.fillStyle="black"
        context.font = `${30/scale}px Arial`;
        context.fillText(`angle = ${(-arrowEnd.arg/Math.PI).toFixed(6)} PI`, (10-translateX)/scale, (100-translateY)/scale);
    }
    context.restore();
}

function angleFromPQ() {
    return Math.atan(Math.sqrt(3)/((2*p_input.value/q_input.value)-1))
}

function nextPoint(point,direction) {
    let line = null
    let temp_point={x:point.x+1000*Math.cos(direction),y:point.y+1000*Math.sin(direction)}
    for (let i = 0; i < figure.length; i++) {
        if (i==figure.length-1) {
            ip1=0
        }else{
            ip1=i+1
        }
        if(doIntersect({u:figure[i],v:figure[ip1]}, {u:{x:point.x+Math.cos(direction)/scale,y:point.y+Math.sin(direction)/scale},v:{x:temp_point.x+Math.cos(direction)/scale,y:temp_point.y+Math.sin(direction)/scale}})){
            line={u:figure[i],v:figure[ip1]}
            let result = line_intersect(line, {u:point,v:{x:point.x+Math.cos(direction)/scale,y:point.y+Math.sin(direction)/scale}})
            temp_point = {x:result.x,y:result.y}
        }
    }
    /* a1=Math.tan(direction)
    b1=point.y-a1* */
    let newPointDirection = null
    if (line!=null) {
        newPointDirection = behavior(temp_point,direction,line)
    }
    return newPointDirection
}

function createPoints(){
    last_direction=arrowEnd.arg
    points=new Array(parseInt(lineNumber_input.value)+1)
    points[0]=cursor
    let result=null
    for (let i = 0; i < points.length-1 && points[i]!=null; i++) {
        result = nextPoint(points[i],last_direction)
        points[i+1]=result!=null ? result.point : null
        last_direction=result!=null ? result.direction : last_direction
    }
}

arrowEnd.arg=angleFromPQ()
createPoints()
draw()

let inCursor = false;
let posInCursor = null

let inArrowEnd = false;
let posInArrowEnd = null;
let initialPos = null;

function mouseMove(e) {
    offset = getCoords(canvas)
    offset.top=(-offset.top+translateY)/scale
    offset.left=(offset.left+translateX)/scale
    eX=e.clientX/scale
    eY=(2*translateY-e.clientY)/scale
    //inCursor= eX<=cursor.x+cursor.width+offset.left&&eX>=cursor.x+offset.left&&eY<=cursor.y+cursor.height+offset.top&&eY>=cursor.y+offset.top;
    inCursor = Math.sqrt(Math.pow(eX - cursor.x - offset.left, 2) + Math.pow(eY - cursor.y - offset.top, 2)) <= cursor.radius
    inArrowEnd = Math.sqrt(Math.pow(eX - (cursor.x+arrowEnd.r*Math.cos(arrowEnd.arg)) - offset.left, 2) + Math.pow(eY - (cursor.y+arrowEnd.r*Math.sin(arrowEnd.arg)) - offset.top, 2)) <= arrowEnd.radius

    if (posInCursor != null) {
        cursor.x = initialPos.x - Math.pow(10,-range_input.value)*(initialPos.x - eX) - posInCursor.x - offset.left
        cursor.y = initialPos.y - Math.pow(10,-range_input.value)*(initialPos.y - eY) - posInCursor.y - offset.top
        createPoints()
    }
    if (posInArrowEnd != null) {
        arrowEnd.arg = posInArrowEnd.arg + initialPos.arg - Math.pow(10,-range_input.value)*(initialPos.arg - Math.atan2((eY - cursor.y - offset.top),(eX - cursor.x - offset.left)))
        createPoints()
    }
    draw(inCursor, inArrowEnd, posInCursor != null, posInArrowEnd != null)
}

canvas.onmousemove = mouseMove;
canvas.onmousewheel = mouseMove;

canvas.onmousedown = function (e) {
    eX=e.clientX/scale
    eY=(2*translateY-e.clientY)/scale
    if (posInCursor == null && inCursor) {
        posInCursor = { x: eX - cursor.x - offset.left, y: eY - cursor.y - offset.top }
        initialPos = {x:eX, y: eY}
    }
    if (posInArrowEnd == null && inArrowEnd) {
        posInArrowEnd = { arg: arrowEnd.arg - Math.atan2((eY - cursor.y - offset.top),(eX - cursor.x - offset.left))}
        initialPos = {arg:Math.atan2((eY - cursor.y - offset.top),(eX - cursor.x - offset.left))}
    }
}
canvas.onmouseup = function (e) {
    posInCursor = null
    posInArrowEnd = null
}
canvas.onmouseleave = function () {
    posInCursor = null
    posInArrowEnd = null
    draw()
}
lineNumber_input.onchange=function(e){
    createPoints()
    draw()
}
p_input.onchange=function(){
    arrowEnd.arg=angleFromPQ()
    /* var p = p_input.value
    var q = q_input.value
    lineNumber_input.value = Math.abs(2*p-q) + Math.abs(p-2*q) + Math.abs(p+q) */
    createPoints()
    draw()
}
q_input.onchange=function(){
    arrowEnd.arg=angleFromPQ()
    /* var p = p_input.value
    var q = q_input.value
    lineNumber_input.value = Math.abs(2*p-q) + Math.abs(p-2*q) + Math.abs(p+q) */
    createPoints()
    draw()
}
