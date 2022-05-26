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
  var u = weierstrassP(z,0,1/27);
  var v = weierstrassPPrime(z,0,1/27);
  return [div(mul(6,u),add(mul(3,v),1)),div(sub(1,mul(3,v)),add(1,mul(3,v)))] /* 6u/(3v+1),(1-3V)/(1+3V) */
}

getData_button.onclick = function () {
  var [point, direction] = billiard_frame.contentWindow.getData()
  var v = exp(complex(0,direction))
  var z = complex(point.x, point.y)
  var [x, y] = getInitCoords(z).map(a => 
    div(a,mul(beta(1/3,1/3),v))
  );
  console.log([x, y])
}
