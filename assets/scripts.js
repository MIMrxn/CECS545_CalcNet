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
		//console.log("This is the current statement: " + curr_stmt + "\n");
		
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
	//console.log("This is the current right hand side: " + rhs + "\n");

	var e_result = null;
	e_result = machine_p(rhs);

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
		//console.log("This is term " + (i+1) + ": " + term);

		//	TODO: We will have to transition to some type of pattern here
		//	to support two T machines and async methodology
		//var t_result = machine_t(term);
		var t1_result = null;
		var t2_result = null;

		var mh = new MachineHandler();
		//console.log("T1 is subscribed: " + mh.isSubscribed("t1"));
		//console.log("T2 is subscribed: " + mh.isSubscribed("t2"));

		mh.subscribeMachine("t1", machine_t);
		//mh.subscribeMachine("t2", machine_t);

		mh.publishMachine("t1", term);
		//mh.publishMachine("t2", term);
	}
}

function machine_t(term) {
	//	TODO: all functionality is still WORK IN PROGRESS
	var factors = term.split("*");

	for(var i=0; i<factors.length; i++) {
		factor = factors[i];
		
		if (isConstant(factor)) {
			console.log("Constant factor: " + factor + "\n");
			//return factor;
		} else if (isExponentiation(factor)) {
			console.log("Exponentiation factor: " + factor + "\n");
			//	TODO: Go to P
		} else if (isVariable(factor)) {
			console.log("Variable factor: " + factor + "\n");
			//	TODO: Go to D
		}
	}
}

// TODO: not sure I did this right... please correct any mistakes.
function machine_p(expression) {
	var power_terms = [];

	// Split off the power terms into the variable and the constant integer exponent
	// Ex: 4^2 is split off into "4" and "2"
	power_terms = expression.split("^");
 
	// Get the variable and constant term from the power term
	var variable_term = power_terms[0];
	console.log("This is power term 0: " + variable_term);

	var constant_term = power_terms[1];
	console.log("This is power term 1: " + constant_term);

	// Send load message with the variable term to D machine
	var concatenated_terms = variable_term + " " + constant_term;
	console.log("This is concatenated term : " + concatenated_terms);

	var d_result = machine_d(variable_term, concatenated_terms); 
	console.log(d_result);

	// Use the result value to compute the exponential value and return it to the sender.
	console.log("The result of the exponential is: " + Math.pow(d_result, constant_term));
	return Math.pow(d_result, constant_term);
}

// TODO: not sure I did this right... please correct any mistakes.
function machine_d(variable, variable_and_constant) {
	var variable_array = [];

	// Create variable object to store the variable names and their values in.
	var variable_object = {
		// Initialize variable with its name and value
		init: function (name, value) {
			this.name = name;
			this.value = value;
		},

		// Print function
		print: function () {
			var description = this.name + " = " + this.value;
			return description;
		},

		// Get variable name
		get_name: function () {
			return this.name;
		},

		// Get variable's current value
		get_value: function () {
			return this.value;
		}
	};

	// Split the message term into the variable name and constant
	// Create a new object and initialize with given terms, then push to array.
	var message_term = variable_and_constant.split(" ");
	var varname = message_term[0];
	var constant = message_term[1];
	var stored_var = Object.create(variable_object);
	stored_var.init(varname, constant);
	variable_array.push(stored_var);

	// Return the current value of the variable
	for(var i = 0; i < variable_array.length; i++) {
		if(variable_array[i].get_name() === variable) {
			return variable_array[i].get_value();
		}
	}
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

function isConstant(factor) {
	return /^\d+$/.test(factor);
}

function isVariable(factor) {
	return /[A-Z]/.test(factor);
}

function isExponentiation(factor) {
	return factor.includes("^");
}

class MachineHandler {

	constructor() {
		this.machines = [];
	}

	subscribeMachine(machine, machine_method) {
		if(this.machines[machine] == null) {
			this.machines[machine] = [];
		}

		this.machines[machine].push(machine_method);
		console.log("Subscribed: " + machine + "\n");
	}

	publishMachine(machine, message) {
		/*
		for(const machine_method of this.machines[machine]) {
			console.log("Message is " + message + "\n");
			console.log("And function is " + machine_method + "\n");
			machine_method(message);
		}
		*/
		this.machines[machine].forEach(function (machine_method) {
			console.log("Message is " + message + "\n");
			console.log("And function is " + machine_method(message) + "\n");
			machine_method(message);
		});
	}

	/*
	isSubscribed(machine) {
		for(mech in this.machines) {
			if(mech === machine) {
				return true;
			}
		}
		return false;
	}
	*/

	unsubscribe(machine) {
		for(this.machine in this.machines) {
			if(this.machine === machine) {
				delete this.machines[machine];
				console.log("Deleted machine " + machine + " from subscriptions.\n");
			}
		}
	}
}
