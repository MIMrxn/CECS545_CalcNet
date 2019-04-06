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
	//var results = [];
	//results = machine_i();
	var machine_d = new MachineD();
	var machine_i = new MachineI(machine_d);
	
	var results = machine_i.run();
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
	return /[a-zA-Z]/.test(factor);
}

function isExponentiation(factor) {
	return factor.includes("^");
}

class MachineI {
	constructor(machine_d) {
		this.inputs = get_inputs();
		this.results = [];
		this.machine_d = machine_d;
	}

	run() {
		var curr_stmt = null;
		for(var i=0; i<this.inputs.length-1; i++) {
			curr_stmt = this.inputs[i].split(".")[0];
			console.log("This is the current statement: " + curr_stmt + "\n");
			
			var curr_result = null;
			//curr_result = machine_a(curr_stmt);
			var machine_a = new MachineA(curr_stmt, this.machine_d);
			curr_result = machine_a.run();

			if(curr_result === null) {
				alert("There was an error retrieving result from Machine A with statement: " + curr_stmt + "\n");
				return false;
			} else {
				this.results.push(curr_result);
			}
		}

		if(this.results.length === 5) {
			return this.results;
		} else {
			alert("There was an error retrieving all the results.");
			return false;
		}
	}
}

class MachineD {
	constructor() {
		this.vars_array = [];
	}

	load(letter) {
		if(this.vars_array[letter] === null) {
			alert("There is no value associated with that value.");
		} else {
			return this.vars_array[letter];
		}
	}

	store(letter, const_value) {
		this.vars_array[letter] = const_value;
		return true;
	}
}

class MachineA {
	constructor(stmt, machine_d) {
		this.stmt = stmt;
		this.machine_d = machine_d;
	}

	run() {
		var lhs = this.stmt.split("=")[0];
		var rhs = this.stmt.split("=")[1];
		console.log("This is the current right hand side: " + rhs + "\n");
		var e_result = null;
		//e_result = machine_p(this.rhs);
		var machine_e = new MachineE(rhs, this.machine_d);
		e_result = machine_e.run();

		if(e_result === null) {
			alert("There was an error retrieving result from Machine E with statement: " + this.stmt + "\n");
			return false;
		} else {
			//	Send result (Store MSG) to D machine
			//	Upon receiving Stored result MSG return value to I Machine
			var stored = this.machine_d.store(lhs, e_result);
			if(stored) {
				console.log(lhs + " = " + rhs + " = " + e_result);
				return e_result;
			}
		}
	}
}

class MachineE {
	constructor(expression, machine_d) {
		this.expression = expression;
		this.machine_d = machine_d;
	}

	run() {
		var terms = [];
		terms = this.expression.split("+");

		var sum = 0;
		for(var i=0; i<terms.length; i++) {
			var term = terms[i];
			console.log("This is term " + (i+1) + ": " + term);

			var t_result = null;

			var machine_t = new MachineT(term, this.machine_d);
			var product = machine_t.run();
			sum += product;
		}

		return sum;
	}
}

class MachineT {
	constructor(term, machine_d) {
		this.term = term;
		this.machine_d = machine_d;
	}

	run() {
		var factors = this.term.split("*");

		var product = 1;
		for(var i=0; i<factors.length; i++) {
			var factor = factors[i];
			console.log("Current factor: "+factor+"\n");
			
			if (isConstant(factor)) {
				console.log("Constant factor: " + factor + "\n");
				product *= factor;
			} else if (isExponentiation(factor)) {
				console.log("Exponentiation factor: " + factor + "\n");
				var machine_p = new MachineP(factor, this.machine_d);
				var p_result = machine_p.run();
				product *= p_result;
			} else if (isVariable(factor)) {
				console.log("Variable factor: " + factor + "\n");
				var d_result = this.machine_d.load(factor);
				product *= d_result;
			}
		}

		return product;
	}
}

class MachineP {
	constructor(expression, machine_d) {
		this.expression = expression;
		this.machine_d = machine_d;
	}

	run() {
		var power_terms = [];

		// Split off the power terms into the variable and the constant integer exponent
		// Ex: 4^2 is split off into "4" and "2"
		power_terms = this.expression.split("^");
	 
		// Get the variable and constant term from the power term
		var variable_term = power_terms[0];
		console.log("This is power term 0: " + variable_term);

		var constant_term = power_terms[1];
		console.log("This is power term 1: " + constant_term);

		// Send load message with the variable term to D machine
		var d_result = this.machine_d.load(variable_term);
		console.log("D result from var " + variable_term + " = " + d_result);

		// Use the result value to compute the exponential value and return it to the sender.
		//console.log("The result of the exponential is: " + Math.pow(d_result, constant_term));
		return Math.pow(d_result, constant_term);
	}
}

/*
class MachineHandler {
	constructor() {
		this.machine_i = new MachineI();
		this.machine_d = new MachineD();
		this.machine_a = new MachineA();
		this.machine_e = new MachineE();
		this.machine_t = new MachineT();
		this.machine_p = new MachineP();
	}

	run() {
		
	}
}
*/

/*
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
		
		this.machines[machine].forEach(function (machine_method) {
			console.log("Message is " + message + "\n");
			console.log("And function is " + machine_method(message) + "\n");
			machine_method(message);
		});
	}

	unsubscribe(machine) {
		for(this.machine in this.machines) {
			if(this.machine === machine) {
				delete this.machines[machine];
				console.log("Deleted machine " + machine + " from subscriptions.\n");
			}
		}
	}
}
*/