var trace1 = {
  x: [1, 2, 3, 4],
  y: [5, 10, 2, 8],
  mode: "lines"
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
  /* x=div(add(1,exp(complex(0,2*pi/3))),pow(sub(1,pow(complex(0,1),3)),1/3))
  y=mul(x,complex(0,1)) */
  console.log([x,y])
  var coords = ode(((t,v)=> [pow(v[1], 2), pow(v[0], 2)]),[x, y],[0,100],0.001)

  data = [{
    x: coords.map(point=>(point[1].re!=0||point[1].im!=0) ? (div(point[2],point[1]).re) : (null)),
    y: coords.map(point=>(point[1].re!=0||point[1].im!=0) ? (div(point[2],point[1]).im) : (null)),
    mode: "lines"
  }]
  console.log(data)
  Plotly.react('graph', data, layout);

}
