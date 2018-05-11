(function(){
	   
  Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas)
    var particleSystem = null

    var that = {
      init: function(system) {
        particleSystem = system;
        particleSystem.screenSize(canvas.width, canvas.height); 
        particleSystem.screenPadding(100);

        that.initMouseHandling();
      },

      redraw: function() {
    	  
    	 ctx.fillStyle = "white";
    	 ctx.fillRect(0, 0, canvas.width, canvas.height);
    	 
    	 // draw the nodes & save their bounds for edge drawing
        particleSystem.eachNode(function(node, pt) {
        	ctx.beginPath();
        	ctx.arc(pt.x, pt.y, 15, 0, 2 * Math.PI);
        	// if node.key is a number, then it's a school, and set the color to green.
        	if (typeof node.key == 'number') 
        		{ node.data.color = 'green'; }
        	ctx.fillStyle = node.data.color;
        	ctx.fill();
        	ctx.font = "18px Arial";
        	ctx.fillStyle = node.data.color;
        	
        	// console.log("node.data.label = " + node.data.label);
        	if (node.data.name == undefined)
        		{ node.data.name = node.data.label; }
        	if (node.data.label == undefined) {
                  	ctx.fillText(node.label, pt.x + 20, pt.y + 5);
                  	node.data.label = node.label;
        	} else {
        		ctx.fillText(node.data.label, pt.x + 20, pt.y + 5);
        	}
        })    	// end of eachNode function		


        // draw the edges
        particleSystem.eachEdge(function(edge, pt1, pt2) {
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords
        	ctx.strokeStyle = edge.data.linkcolor;
        	ctx.lineWidth = 3;
        	ctx.beginPath();
        	ctx.moveTo(pt1.x, pt1.y);
        	ctx.lineTo(pt2.x, pt2.y);
        	ctx.stroke();
        }) // end of eachEdge function

      },  // end of redraw function
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        selected = null;
        nearest = null;
        var dragged = null;
        var oldmass = 1

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            selected = nearest = dragged = particleSystem.nearest(_mouseP);
            //  alert("*You have clicked on " + selected.node.name);
            // window.location = selected.node.data.link;
              gfx.clear();
            
             // alert("In renderer, nodesToErase is " + JSON.stringify(nodesToErase));
        	  for (var key in nodesToErase) { 
      	      	sys.pruneNode(key);
      	      }
    	      	// alert("Deleted all nodes.");
    	      	nodesToErase = {};
              if (selected.node.name.length == 1) 
           	  {
            	  letterChosen(selected.node.name);
           	  }
              else
              {
            	  if (selected.node.name == 'ROOT')
            		  {
            		  	rootClicked(selected.node.name);
            		  }
            	  else
            		  {
            		 // alert("Now looking at selected.node.data.color. At this point, the selected.node.name = " + JSON.stringify(selected.node.name));
            		  if (selected.node.data.color == 'blue')
            			  {
            			  // only attributes are blue.
            			  	attrClicked(selected.node.name);
            			  }
            		  else
            			  {  
             			  	schoolClicked(selected.node.name); // schools have no color.
            			  }
            		  }
              }
            
            // $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },  //end of clicked function

       /* 
          dragged:function(e){
            var old_nearest = nearest && nearest.node._id
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (!nearest) return
            if (dragged !== null && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },
*/
          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 50
            dragged = null
            selected = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          } // end dropped

        } // end handler
        $(canvas).mousedown(handler.clicked);

      } // end initMouseHandling

     }

    // helpers for figuring out where to draw arrows (thanks springy.js)
    var intersect_line_line = function(p1, p2, p3, p4)
    {
      var denom = ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));
      if (denom === 0) return false // lines are parallel
      var ua = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / denom;
      var ub = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / denom;

      if (ua < 0 || ua > 1 || ub < 0 || ub > 1)  return false
      return arbor.Point(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
    }

    var intersect_line_box = function(p1, p2, boxTuple)
    {
      var p3 = {x:boxTuple[0], y:boxTuple[1]},
          w = boxTuple[2],
          h = boxTuple[3]

      var tl = {x: p3.x, y: p3.y};
      var tr = {x: p3.x + w, y: p3.y};
      var bl = {x: p3.x, y: p3.y + h};
      var br = {x: p3.x + w, y: p3.y + h};

      return intersect_line_line(p1, p2, tl, tr) ||
            intersect_line_line(p1, p2, tr, br) ||
            intersect_line_line(p1, p2, br, bl) ||
            intersect_line_line(p1, p2, bl, tl) ||
            false
    }

    return that
  }    
  
})()