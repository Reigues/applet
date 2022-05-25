var trace1 = {
  type: 'bar',
  x: [1, 2, 3, 4],
  y: [5, 10, 2, 8],
  marker: {
    color: '#C8A2C8',
    line: {
      width: 2.5
    }
  }
};

var data = [trace1];

var layout = {
  title: 'Responsive to window\'s size!',
  font: { size: 18 }
};

var config = { responsive: true }

Plotly.newPlot('graph', data, layout);

document.addEventListener("handlerdragging", (event) => {
  Plotly.react('graph', data, layout);
});

function getInitCoords(z){
  var u = weierstrassP(z,1,1/27);
  console.log(u)
}

getData_button.onclick = function () {
  var [point, direction] = billiard_frame.contentWindow.getData()
  var v = math.complex({abs: 1, arg: direction})
  var z = math.complex({re:point.x, im:point.y})
  var [x, y] = getInitCoords(z)
}
