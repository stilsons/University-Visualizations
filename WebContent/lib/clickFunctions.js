function letterChosen( letter)
{
	alert("You clicked on letter " + letter);
      // All nodes are cleared, so create ROOT and the letter nodes again.
      sys.addNode(letter, {'color':'green','shape':'dot','label':letter, 'name':letter });
      sys.addEdge('ROOT', letter);
      nodesToErase[letter] = { letter:{} };
      // alert("Done erasing nodes. data is now " + JSON.stringify(data));

      // var searchResults = jsonPath(null, data, "[?(@.name =~ /B.*/i)]");
	  var howManyFound = 0;
      for (var key in data) { 
      	if (data.hasOwnProperty(key)) {
     		data[key].label = data[key].name;
//     		alert(key + " -> " + data[key] + ", and .name is " + data[key].name);

      		if (data[key].name.startsWith(letter))
      		{
      			if (howManyFound++ > 30) { continue; }
//      			alert("Found school " + data[key].name + " that starts with " + letter + 
//      			". Its key is " + key + ", and data[key] is " + JSON.stringify(data[key])
//      			+ ". It's name and label are: " + data[key].name + " and " + data[key].label);
      			sys.addNode(key, data[key]);
      			sys.addEdge(letter,key);
      			nodesToErase[key] = data[key];
      		}
      		
      	}
      } // end for
      alert("howManyFound = " + howManyFound);
//	alert("Added schools to nodesToErase, which is now " + JSON.stringify(nodesToErase));
} // end letterChosen

function schoolClicked( schoolId)
{
	// I need to convert the incoming string to the school ID six-digit key.
	alert("You clicked on school " + schoolId + ", and its name is " + JSON.stringify(data[schoolId][name]));
	// Create a node for the school, since all nodes are erased before you get here.
	sys.addNode(schoolId, data[schoolId]);
     nodesToErase[schoolId] = data[schoolId];
     
    var newdata = {};
    for (var key in data[schoolId]) { 
     	if (data[schoolId].hasOwnProperty(key)) {
     		// Create nodes for each attribute.
     		newLabel = key + ": " + data[schoolId][key];
     		 newdata[key] = {'color':'blue','shape':'dot','label': newLabel, 'name': key, 'value': data[schoolId][key] };
     		
     		 $.extend(true, data, newdata);
     		 sys.addNode(newLabel, data[key]);
     	     sys.addEdge(newLabel,schoolId);
     	     nodesToErase[newLabel] = data[key];
       		// alert("Another attribute of " + data[schoolId].label + ": name " +  data[key].name + ", and value is " + data[key].value);

     	}
    }
//    alert("With the addition of newdata, data is now " + JSON.stringify(data));
}

function attrClicked( attributeNode)
{

//	alert("You clicked on attribute " + attributeNode); // ' + ". Its name is: " + data[attributeNode].name + ", and its value is: " + data[attributeNode].value);
   // Don't know why the name and value aren't coming into this method.  So, I'l have to reconstruct them again.
	
	var nodeString = JSON.stringify(attributeNode);
	keyName = nodeString.substring(1,nodeString.search(':'));
	value = parseInt(nodeString.slice(nodeString.search(':') + 2,-1));
	alert("Now keyName is " + keyName + ", and new value is " + value);
	
	// Since we just erased all the nodes, put the node representing the incoming attribute back on the screen.
	data[nodeString] = {'color':'blue','shape':'dot','label': nodeString, 'name': keyName, 'value': value };
	 sys.addNode(nodeString, data[nodeString]);
	 nodesToErase[nodeString] = data[nodeString];
	 
	var howManyFound = 0;
    for (var key in data) {   // scroll through all the schools.
     	if ((data.hasOwnProperty(key) && (data[key][keyName] != undefined)))
     		// only schools have each attribute defined.  Key is the six-digit school number.
     		{
     		// Need to convert data[key][name] to an integer in order to compare with <>.
     		var intToCompare = parseInt(data[key][keyName]);
//     		alert("Looking at the next school " + data[key].label + ", " + keyName +": value " + 
//     				data[key][keyName] + ", to see if it's within 5 on either side of " + value);

     		if ((intToCompare < (value + 5)) && (intToCompare >= (value - 5)))
     		{
      			if (howManyFound++ > 30) { continue; }
     			alert("Found " + data[key].label + ", whose value " + data[key][keyName] + " is close to " + value);
     			sys.addNode(key, data[key]);
     			sys.addEdge(key, nodeString);
      			nodesToErase[key] = data[key];
     		}
     	}
     } // end for
	alert("Found " + howManyFound + " schools.");

}

function rootClicked( root)
{
	alert("You clicked on the " + root);
	      // Clear all nodes except what you clicked on.
	      sys.addNode("ROOT", {'color':'green','shape':'dot','label':'ROOT', 'name':'ROOT'});
	     // alert("Done erasing nodes. data is now " + JSON.stringify(data));
	      
	      // Find only one-letter nodes.
	      for (var key in data) { 
	      	if (data.hasOwnProperty(key)) {
	     		data[key].label = data[key].name;
//	     		alert("data[" + key + "] = " + data[key] + ", and length of the key is " + key.length);
	     		if (key.length == 1)
	      		{
	     			toRender.nodes[key] = data[key]; // Add to nodes.
		     		// alert("Added to nodes: " + key + " -> " + data[key] + ", and .name is " + data[key].name);
	      			sys.addNode(data[key].name, data[key]);
	      			sys.addEdge('ROOT',data[key].name);
	      			nodesToErase[key] = data[key];
	      		}
	      	}
	      } // end for
		alert("nodesToErase is now: " + JSON.stringify(nodesToErase));
} // end rootClicked

