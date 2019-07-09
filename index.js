var draw = SVG('drawing').size('100%', '100%')
var box = draw.viewbox();

var elements = [];
var cutOut = [];
var paths = [];

var elSelected;
var drawing;

var cutting = false;

function chooseShape(n){
    switch (n){
        case 1:
            drawing = draw.rect();
            break;
        case 2:
            drawing = draw.circle();
            break;
        case 3:
            drawing = draw.ellipse();
            break;
    }

    if(cutting){
        callDraw(2);
    }else{
        callDraw(1);
    }
    
}
function callDraw(n){
    switch (n){
        case 1:
            var shape = drawing.draw().fill({ color: '#0f9' });
            console.log(shape)
            elements.push(shape); 
            break;
        case 2:
            var shape = drawing.draw().fill({ color: '#000' });
            cutOut.push(shape); 
            break;
    }
}

function hole(){
   cutting = true;
}

function clipA(){
    let pathObj = toPath(elements[0], "string");
    var cutPoly = pathObj.str;
    for(let i = 0; i < cutOut.length; i++){
        let cut = toPath(cutOut[i], "string");
        cutPoly += " " + cut.str;
        cutOut[i].remove();
    }
    console.log(cutPoly)

    let newShape = draw.path(cutPoly).fill({ color: '#0f9' });
    newShape.attr('fill-rule', 'evenodd');
    
    elements[0].remove();
    
    elements[0] = newShape;

    cutting = false;
}

function exportSVG(){
    let desenho = draw.svg();
    window.sessionStorage.svgData = desenho;
    document.location.href = "three/index.html";
    console.log(desenho)
}



