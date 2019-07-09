function normaliseAttributes(attr){
    for (const a in attr) {
      if (!/fill|stroke|opacity|transform/.test(a)) { delete attr[a] }
    }
  
    return attr
}

function toPath(Shape, returnType){
    var d;
    switch (Shape.type) {
        case 'rect': {
            let w = Shape.node.width.baseVal.value;
            let h = Shape.node.height.baseVal.value;
            let rx = Shape.node.rx.baseVal.value;
            let ry = Shape.node.ry.baseVal.value;
            let x = Shape.node.x.baseVal.value;;
            let y = Shape.node.y.baseVal.value;
    
          // normalise radius values, just like the original does it (or should do)
          if (rx < 0) rx = 0
          if (ry < 0) ry = 0
          rx = rx || ry
          ry = ry || rx
          if (rx > w / 2) rx = w / 2
          if (ry > h / 2) ry = h / 2
    
          if (rx && ry) {
            // if there are round corners
    
            d = [
              ['M', rx + x, y],
              ['h', w - 2 * rx],
              ['a', rx, ry, 0, 0, 1, rx, ry],
              ['v', h - 2 * ry],
              ['a', rx, ry, 0, 0, 1, -rx, ry],
              ['h', -w + 2 * rx],
              ['a', rx, ry, 0, 0, 1, -rx, -ry],
              ['v', -h + 2 * ry],
              ['a', rx, ry, 0, 0, 1, rx, -ry],
              ['z']
            ]
          } else {
            // no round corners, no need to draw arcs
            d = [
              ['M', x, y],
              ['h', w],
              ['v', h],
              ['h', -w],
              ['v', -h],
              ['z']
            ]
          }

          
          break
        }case 'circle':{
            let cx = Shape.node.cx.baseVal.value;
            let cy = Shape.node.cy.baseVal.value;
            let r = Shape.node.r.baseVal.value;

            d = [
                ['M', cx - r, cy],
                ['a', r, r, 0, 1, 0, (r * 2), 0],
                ['a', r, r, 0, 1, 0, -(r * 2), 0],
                ['z']
            ]
            console.log(d)
        
            break
        }
        case 'ellipse': {
          let rx = Shape.node.rx.baseVal.value;
          let ry = Shape.node.ry.baseVal.value;
          let cx = Shape.node.cx.baseVal.value;
          let cy = Shape.node.cy.baseVal.value;
    
          d = [
            ['M', cx - rx, cy],
            ['A', rx, ry, 0, 0, 0, cx + rx, cy],
            ['A', rx, ry, 0, 0, 0, cx - rx, cy],
            ['z']
          ]
    
          break
        }
        case 'polygon':
        case 'polyline':
        case 'line':
    
          d = Shape.array().map(function (arr) {
            return ['L'].concat(arr)
          })
    
          d[0][0] = 'M'
    
          if (Shape.type === 'polygon') { d.push('Z') }
    
          break
        case 'path':
          d = Shape.array()
          break
    }

    let path = new SVG.Path().plot(d)
   
    if(returnType == "string"){

        // let str = path.node.attributes.d.value;

        let el = path.node.outerHTML;
        let str;

        for(let i = 0; i < el.length; i++){
            if(el[i] == "d"){
                if( el[i-1] + el[i] + el[i+1] == " d=" ){
                    str = el[i+3];
                    for(let j = i+4; j < el.length; j++ ){
                        if(el[j] == "z" || el[j] == "Z"){
                            str = str + el[j];
                            break;
                        }else{
                            str = str + el[j];
                        }
                    }
                }
            }
        }

        let pathObj = {
            str: str,
            d: d
        }

        return pathObj;
    }else if( returnType == "shape"){
        return path;
    }
         

    
}
    



