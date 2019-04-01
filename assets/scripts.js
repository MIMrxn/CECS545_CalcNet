//	Simple validation to ensure input are not empty
//	TODO: more complex validation for proper input based on specification
function validate_inputs(theform) {
	if(theform.input1.value.trim() === "") {
		alert("Input 1 must have an expression.");
		return false;
	}
	if(theform.input2.value.trim() === "") {
		alert("Input 2 must have an expression.");
		return false;
	}
	if(theform.input3.value.trim() === "") {
		alert("Input 3 must have an expression.");
		return false;
	}
	if(theform.input4.value.trim() === "") {
		alert("Input 4 must have an expression.");
		return false;
	}
	if(theform.input5.value.trim() === "") {
		alert("Input 5 must have an expression.");
		return false;
	}
}

function run_machines() {
	var results = [];
	results = machine_i();
}

//	Reads the 5 inputs and distributes them to the other machines until results are returned
function machine_i() {
	var inputs = get_inputs();

	var stmt_results = [];
	var curr_stmt = null;
	for(var i=0; i<inputs.length-1; i++) {
		curr_stmt = inputs[i].split(".")[0];
		console.log("This is the current statement: " + curr_stmt + "\n");
		
		var curr_result = null;
		curr_result = machine_a(curr_stmt);

		if(curr_result === null) {
			alert("There was an error retrieving result from Machine A with statement: " + curr_stmt + "\n");
			return false;
		} else {
			stmt_results.push(curr_result);
		}
	}

	if(stmt_results.length === 5) {
		return stmt_results;
	} else {
		alert("There was an error retrieving all the results.");
		return false;
	}
}

function machine_a(stmt) {
	var rhs = stmt.split("=")[1];
	console.log("This is the current right hand side: " + rhs + "\n");

	var e_result = null;
	e_result = machine_e(rhs);

	if(e_result === null) {
		alert("There was an error retrieving result from Machine E with statement: " + stmt + "\n");
		return false;
	} else {
		//	Send result (Store MSG) to D machine
		//	Upon receiving Stored result MSG return value to I Machine
	}
}

function machine_e(expression) {
	var terms = [];
	terms = expression.split("+");

	for(var i=0; i<terms.length; i++) {
		var term = terms[i];
		console.log("This is term " + (i+1) + ": " + term);

		//	TODO: We will have to transition to some type of pattern here
		//	to support two T machines and 
		var t_result = machine_t(term);
	}
}

function machine_t(term) {
	//	TODO: all functionality
}

function get_inputs() {
	var inputs = [];
	location.search
			.substr(1)
			.split("&")
			.forEach(function (param) {
				var param_components = param.split("=");
				inputs.push( decodeURIComponent(param_components[1]) );
			});
	
	if (inputs.length === 0) {
		return null;
	} else {
		return inputs;
	}
}