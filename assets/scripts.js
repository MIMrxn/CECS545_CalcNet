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
	
	var i_results = machine_i.run().then(function(value) {
		//	Work with the final results if needed
		console.log("Value "+ value+"\n");
	});

	return true;
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
		this.draw();
	}

	async run() {
		//var keep_drawing = true;
		var curr_stmt = null;
		for(var i=0; i<this.inputs.length-1; i++) {	
			curr_stmt = this.inputs[i].split(".")[0];
			//window.setTimeout(this.draw(curr_stmt), 1000);
			//this.draw(curr_stmt);
			console.log("This is the current statement: " + curr_stmt + "\n");
			
			var curr_result = null;
			//curr_result = machine_a(curr_stmt);
			var machine_a = new MachineA(curr_stmt, this.machine_d);
			curr_result = await machine_a.run();
			console.log("This is the async result: "+curr_result+"\n");
			//var resolution = await machine_a.run();

			if(curr_result === null) {
				alert("There was an error retrieving result from Machine A with statement: " + curr_stmt + "\n");
				return false;
			} else {
				this.results.push(curr_result);
				
				//window.requestAnimationFrame(this.draw());
				//	Set timeouts for animation
				await new Promise(resolve => {
					setTimeout(resolve, 1000)
				})
				this.update(curr_stmt);
			}
		}

		if(this.results.length === 5) {
			return this.results;
		} else {
			alert("There was an error retrieving all the results.");
			return false;
		}
	}

	draw() {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");
		
		//	Inputs rectangle
		ctx.font = "14px Arial";
		ctx.fillText("Input Expression", 0+25, 0+25-4);
		ctx.clearRect(0+25, 0+25, 200, 132);
		ctx.rect(0+25, 0+25, 200, 132);
		ctx.stroke();
		//	Results rectangle
		ctx.fillText("Result", 0+25+200, 0+25-4);
		ctx.clearRect(0+25+200, 0+25, 50, 132);
		ctx.rect(0+25+200, 0+25, 50, 132);
		ctx.stroke();
		
		ctx.fillText("Machine I", (0+25+200)/2, 0+25+132+14);

		//	Populate inputs
		for(var i=0; i<this.inputs.length-1; i++) {
			var input_text = this.inputs[i].split(".")[0];
			if(ctx.measureText(input_text).width > 140) {
				console.log("Width of "+i+": "+ctx.measureText(input_text).width);
				input_text = input_text.substring(0, 22);
				input_text += "...";
			}
			ctx.fillText(input_text, 0+25+12, 0+25+22+(i*25));
		}

		//	Populate results
		for(var i=0; i<this.results.length; i++) {
			var result = this.results[i];
			ctx.clearRect(0+25+8-3+200, 0+25+5+(i*25), 40, 23);
			ctx.rect(0+25+8-3+200, 0+25+5+(i*25), 40, 23);
			ctx.stroke();
			ctx.fillText(result, 0+25+8+200, 0+25+22+(i*25));
		}
	}

	//	For animation use
	update(curr_stmt) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");
		
		//	Inputs rectangle
		ctx.font = "14px Arial";
		ctx.fillText("Input Expression", 0+25, 0+25-4);
		ctx.clearRect(0+25, 0+25, 200, 132);
		ctx.rect(0+25, 0+25, 200, 132);
		ctx.stroke();
		//	Results rectangle
		ctx.fillText("Result", 0+25+200, 0+25-4);
		ctx.clearRect(0+25+200, 0+25, 50, 132);
		ctx.rect(0+25+200, 0+25, 50, 132);
		ctx.stroke();
		
		ctx.fillText("Machine I", (0+25+200)/2, 0+25+132+14);

		//	Populate inputs
		for(var i=0; i<this.inputs.length-1; i++) {
			var input_text = this.inputs[i].split(".")[0];
			if(input_text===curr_stmt) {
				ctx.clearRect(0+25+8, 0+25+5+(i*25), 185, 23);
				ctx.rect(0+25+8, 0+25+5+(i*25), 185, 23);
				ctx.stroke();
			}
			if(ctx.measureText(input_text).width > 140) {
				console.log("Width of "+i+": "+ctx.measureText(input_text).width);
				input_text = input_text.substring(0, 22);
				input_text += "...";
			}
			ctx.fillText(input_text, 0+25+12, 0+25+22+(i*25));
		}

		//	Populate results
		for(var i=0; i<this.results.length; i++) {
			var result = this.results[i];
			ctx.clearRect(0+25+8-3+200, 0+25+5+(i*25), 40, 23);
			ctx.rect(0+25+8-3+200, 0+25+5+(i*25), 40, 23);
			ctx.stroke();
			ctx.fillText(result, 0+25+8+200, 0+25+22+(i*25));
		}
	}
}

class MachineD {
	constructor() {
		this.vars_array = [];
		//this.draw();
	}

	async load(letter) {
		if(this.vars_array[letter] === null) {
			alert("There is no value associated with that value.");
		} else {
			var loaded_value = this.vars_array[letter];

			await new Promise(resolve => {
				setTimeout(resolve, 1000)
			})
			this.update("Load", letter, loaded_value);
			
			return loaded_value;
		}
	}

	async store(letter, const_value) {
		this.vars_array[letter] = const_value;
		
		await new Promise(resolve => {
			setTimeout(resolve, 1000)
		})
		this.update("Store", letter, const_value);
		
		return true;
	}

	draw() {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");
		
		//	Draw connection line
		//	X = origin + initial offset + machine I input box width + machine I result width + connection + quarter of machine A width
		//	Y = origin + initial offset + machine I input/result box height / 2 + machine A height box / 2
		ctx.moveTo(0+25+(200+50)+100+(185+50)/4, 0+25+(132/2)+(30/2));
		ctx.lineTo(0+25+(200+50)+100+(185+50)/4, 0+25+(132/2)+(30/2)+100);
		ctx.stroke();

		//	Message Type Rectangle
		ctx.clearRect(0+25+(200+50)+100, 0+25+132/2+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100, 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText("Type", 0+25+(200+50)+100, 0+25+(132/2)+(30/2)+100-4);
			
		//	Variable Rectangle
		ctx.clearRect(0+25+(200+50)+100+(75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.fillText("Variable", 0+25+(200+50)+100+(75), 0+25+(132/2)+(30/2)+100-4);

		//	Value Rectangle
		ctx.clearRect(0+25+(200+50)+100+(75+75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(75+75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.fillText("Value", 0+25+(200+50)+100+(75+75), 0+25+(132/2)+(30/2)+100-4);

		ctx.fillText("Machine D", 0+25+(200+50)+100+(185/2), 0+25+(132/2)+100+(30)+2*14);

		//	Connect to other machines
		ctx.moveTo(0+25+(200+50)+100+(75*3), 0+25+(132/2)+(30)+100);
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100, 0+25+(132/2)+(30)+100);
		ctx.stroke();

		ctx.moveTo(0+25+(200+50)+100+(75*3), 0+25+(132/2)+(30)+100);
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100, 0+25+(132/2)+(30)+100+30+100);
		ctx.stroke();
	}

	update(msg_type, letter, const_value) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");
		
		//	Draw connection line
		//	X = origin + initial offset + machine I input box width + machine I result width + connection + quarter of machine A width
		//	Y = origin + initial offset + machine I input/result box height / 2 + machine A height box / 2
		ctx.moveTo(0+25+(200+50)+100+(185+50)/4, 0+25+(132/2)+(30/2));
		ctx.lineTo(0+25+(200+50)+100+(185+50)/4, 0+25+(132/2)+(30/2)+100);
		ctx.stroke();

		//	Message Type Rectangle
		ctx.clearRect(0+25+(200+50)+100, 0+25+132/2+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100, 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(msg_type, 0+25+(200+50)+100+20, 0+25+(132/2)+(30/2)+100+20);
		ctx.fillText("Type", 0+25+(200+50)+100, 0+25+(132/2)+(30/2)+100-4);
			
		//	Variable Rectangle
		ctx.clearRect(0+25+(200+50)+100+(75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.fillText(letter, 0+25+(200+50)+100+(75)+20, 0+25+(132/2)+(30/2)+100+20);
		ctx.fillText("Variable", 0+25+(200+50)+100+(75), 0+25+(132/2)+(30/2)+100-4);

		//	Value Rectangle
		ctx.clearRect(0+25+(200+50)+100+(75+75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(75+75), 0+25+(132/2)+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.fillText(const_value, 0+25+(200+50)+100+(75+75)+20, 0+25+(132/2)+(30/2)+100+20);
		ctx.fillText("Value", 0+25+(200+50)+100+(75+75), 0+25+(132/2)+(30/2)+100-4);

		ctx.fillText("Machine D", 0+25+(200+50)+100+(185/2), 0+25+(132/2)+100+(30)+2*14);

		//	Connect to other machines
		ctx.moveTo(0+25+(200+50)+100+(75*3), 0+25+(132/2)+(30)+100);
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100, 0+25+(132/2)+(30)+100);
		ctx.stroke();
	}
}

class MachineA {
	constructor(stmt, machine_d) {
		this.stmt = stmt;
		this.machine_d = machine_d;

	}

	async run() {
		var lhs = this.stmt.split("=")[0];
		var rhs = this.stmt.split("=")[1];
		console.log("This is the current right hand side: " + rhs + "\n");

		await new Promise(resolve => {
			setTimeout(resolve, 1000)
		})
		this.draw(rhs);

		var e_result = null;
		//e_result = machine_p(this.rhs);
		var machine_e = new MachineE(rhs, this.machine_d);
		e_result = await machine_e.run();

		if(e_result === null) {
			alert("There was an error retrieving result from Machine E with statement: " + this.stmt + "\n");
			return false;
		} else {
			//	Send result (Store MSG) to D machine
			//	Upon receiving Stored result MSG return value to I Machine
			var stored = await this.machine_d.store(lhs, e_result);
			if(stored) {
				console.log(lhs + " = " + rhs + " = " + e_result);
				
				await new Promise(resolve => {
					setTimeout(resolve, 1000)
				})
				this.update(rhs, e_result);
				
				return e_result;
			}
		}
	}

	draw(rhs) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line
		//	X = origin + initial offset + machine I input box width + machine I result width
		//	Y = origin + initial offset + machine I input/result box height / 2
		ctx.moveTo(0+25+200+50, 0+25+132/2);
		ctx.lineTo(0+25+200+50+100, 0+25+132/2);
		ctx.stroke();

		//	Right hand side (rhs) rectangle
		ctx.clearRect(0+25+200+50+100, 0+25+132/2-(30/2), 185, 30);
		ctx.rect(0+25+200+50+100, 0+25+132/2-(30/2), 185, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(rhs, 0+25+200+50+100+20, 0+25+132/2-(30/2)+20);
		ctx.fillText("Right Hand Side", 0+25+200+50+100, 0+25+132/2-(30/2)-4);
		
		//	Machine E result rectangle
		ctx.clearRect(0+25+200+50+100+185, 0+25+132/2-(30/2), 50, 30);
		ctx.rect(0+25+200+50+100+185, 0+25+132/2-(30/2), 50, 30);
		ctx.stroke();
		ctx.fillText("Result", 0+25+200+50+100+185, 0+25+132/2-(30/2)-4);

		ctx.fillText("Machine A", 0+25+200+50+100+185/2, 0+25+132/2+2*14);
	}

	update(rhs, e_result) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line
		//	X = origin + initial offset + machine I input box width + machine I result width
		//	Y = origin + initial offset + machine I input/result box height / 2
		ctx.moveTo(0+25+200+50, 0+25+132/2);
		ctx.lineTo(0+25+200+50+100, 0+25+132/2);
		ctx.stroke();

		//	Right hand side (rhs) rectangle
		ctx.clearRect(0+25+200+50+100, 0+25+132/2-(30/2), 185, 30);
		ctx.rect(0+25+200+50+100, 0+25+132/2-(30/2), 185, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(rhs, 0+25+200+50+100+20, 0+25+132/2-(30/2)+20);
		ctx.fillText("Right Hand Side", 0+25+200+50+100, 0+25+132/2-(30/2)-4);
		
		//	Machine E result rectangle
		ctx.clearRect(0+25+200+50+100+185, 0+25+132/2-(30/2), 50, 30);
		ctx.rect(0+25+200+50+100+185, 0+25+132/2-(30/2), 50, 30);
		ctx.stroke();
		ctx.fillText(e_result, 0+25+200+50+100+185+15, 0+25+132/2-(30/2)+20);
		ctx.fillText("Result", 0+25+200+50+100+185, 0+25+132/2-(30/2)-4);

		ctx.fillText("Machine A", 0+25+200+50+100+185/2, 0+25+132/2+2*14);
	}
}

class MachineE {
	constructor(expression, machine_d) {
		this.expression = expression;
		this.machine_d = machine_d;
		//this.draw();
	}

	async run() {
		var terms = [];
		terms = this.expression.split("+");

		var sum = 0;
		for(var i=0; i<terms.length; i++) {
			var term = terms[i];
			console.log("This is term " + (i+1) + ": " + term);

			await new Promise(resolve => {
				setTimeout(resolve, 1000)
			})
			this.draw(term);

			var t_result = null;

			var machine_t = new MachineT(term, this.machine_d);
			var product = await machine_t.run();
			sum += product;

			await new Promise(resolve => {
				setTimeout(resolve, 1000)
			})
			this.update(term, product, sum);
		}

		return sum;
	}

	draw(term) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line
		//	X = origin + initial offset + machine I input width + machine I result width + connector + machine A width
		//	Y = origin + initial offset + machine I input/result box height / 2
		ctx.moveTo(0+25+200+50+100+185+50, 0+25+132/2);
		ctx.lineTo(0+25+200+50+100+185+50+100, 0+25+132/2);
		ctx.stroke();

		//	Term rectangle
		ctx.clearRect(0+25+200+50+100+185+50+100, 0+25+132/2-(30/2), 100, 30);
		ctx.rect(0+25+200+50+100+185+50+100, 0+25+132/2-(30/2), 100, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(term, 0+25+200+50+100+185+50+100+20, 0+25+132/2-(30/2)+20);
		ctx.fillText("Term", 0+25+200+50+100+185+50+100, 0+25+132/2-(30/2)-4);

		//	Result rectangle
		ctx.clearRect(0+25+200+50+100+185+50+100+100, 0+25+132/2-(30/2), 75, 30);
		ctx.rect(0+25+200+50+100+185+50+100+100, 0+25+132/2-(30/2), 75, 30);
		ctx.stroke();
		ctx.fillText("Result", 0+25+200+50+100+185+50+100+100, 0+25+132/2-(30/2)-4);

		//	Sum rectangle
		ctx.clearRect(0+25+200+50+100+185+50+100+100+75, 0+25+132/2-(30/2), 50, 30);
		ctx.rect(0+25+200+50+100+185+50+100+100+75, 0+25+132/2-(30/2), 100, 30);
		ctx.stroke();
		ctx.fillText("Sum", 0+25+200+50+100+185+50+100+100+75, 0+25+132/2-(30/2)-4);

		ctx.fillText("Machine E", 0+25+200+50+100+185+50+100+(100+75)/2, 0+25+132/2+2*14);
	}

	update(term, result, sum) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line
		//	X = origin + initial offset + machine I input width + machine I result width + connector + machine A width
		//	Y = origin + initial offset + machine I input/result box height / 2
		ctx.moveTo(0+25+200+50+100+185+50, 0+25+132/2);
		ctx.lineTo(0+25+200+50+100+185+50+100, 0+25+132/2);
		ctx.stroke();

		//	Term rectangle
		ctx.clearRect(0+25+200+50+100+185+50+100, 0+25+132/2-(30/2), 100, 30);
		ctx.rect(0+25+200+50+100+185+50+100, 0+25+132/2-(30/2), 100, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(term, 0+25+200+50+100+185+50+100+20, 0+25+132/2-(30/2)+20);
		ctx.fillText("Term", 0+25+200+50+100+185+50+100, 0+25+132/2-(30/2)-4);

		//	Result rectangle
		ctx.clearRect(0+25+200+50+100+185+50+100+100, 0+25+132/2-(30/2), 75, 30);
		ctx.rect(0+25+200+50+100+185+50+100+100, 0+25+132/2-(30/2), 75, 30);
		ctx.stroke();
		ctx.fillText(result, 0+25+200+50+100+185+50+100+100+20, 0+25+132/2-(30/2)+20);
		ctx.fillText("Result", 0+25+200+50+100+185+50+100+100, 0+25+132/2-(30/2)-4);

		//	Sum rectangle
		ctx.clearRect(0+25+200+50+100+185+50+100+100+75, 0+25+132/2-(30/2), 50, 30);
		ctx.rect(0+25+200+50+100+185+50+100+100+75, 0+25+132/2-(30/2), 100, 30);
		ctx.stroke();
		ctx.fillText(sum, 0+25+200+50+100+185+50+100+100+75+20, 0+25+132/2-(30/2)+20);
		ctx.fillText("Sum", 0+25+200+50+100+185+50+100+100+75, 0+25+132/2-(30/2)-4);

		ctx.fillText("Machine E", 0+25+200+50+100+185+50+100+(100+75)/2, 0+25+132/2+2*14);
	}
}

class MachineT {
	constructor(term, machine_d) {
		this.term = term;
		this.machine_d = machine_d;
	}

	async run() {
		var factors = this.term.split("*");

		var product = 1;
		for(var i=0; i<factors.length; i++) {
			var factor = factors[i];
			console.log("Current factor: "+factor+"\n");
			await new Promise(resolve => {
				setTimeout(resolve, 1000)
			})
			this.draw(factor);


			if (isConstant(factor)) {
				console.log("Constant factor: " + factor + "\n");
				product *= factor;
				
				await new Promise(resolve => {
					setTimeout(resolve, 1000)
				})
				this.update(factor, factor, product);

			} else if (isExponentiation(factor)) {
				console.log("Exponentiation factor: " + factor + "\n");
				var machine_p = new MachineP(factor, this.machine_d);
				var p_result = await machine_p.run();
				product *= p_result;
				
				await new Promise(resolve => {
					setTimeout(resolve, 1000)
				})
				this.update(factor, p_result, product);

			} else if (isVariable(factor)) {
				console.log("Variable factor: " + factor + "\n");
				var d_result = await this.machine_d.load(factor);
				product *= d_result;
				
				await new Promise(resolve => {
					setTimeout(resolve, 1000)
				})
				this.update(factor, d_result, product);
			}
		}

		return product;
	}

	draw(factor) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line
		ctx.moveTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2));
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2)+100);
		ctx.stroke();

		//	Factor rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100, 100, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100, 100, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(factor, 0+25+(200+50)+100+(185+50)+100+20, 0+25+132/2+(30/2)+100+20);
		ctx.fillText("Factor", 0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100-4);
		
		//	Result rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.fillText("Result", 0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100-4);

		//	Product rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100+(100+75), 0+25+132/2+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100+(100+75), 0+25+132/2+(30/2)+100, 100, 30);
		ctx.stroke();
		ctx.fillText("Product", 0+25+(200+50)+100+(185+50)+100+(100+75), 0+25+132/2+(30/2)+100-4);

		ctx.fillText("Machine T", 0+25+(200+50)+100+(185+50)+100+(100+75)/2, 0+25+132/2+(30/2)+100+3*14);
	}

	update(factor, result, product) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line
		ctx.moveTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2));
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2)+100);
		ctx.stroke();

		//	Factor rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100, 100, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100, 100, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(factor, 0+25+(200+50)+100+(185+50)+100+20, 0+25+132/2+(30/2)+100+20);
		ctx.fillText("Factor", 0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100-4);
		
		//	Result rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100, 75, 30);
		ctx.stroke();
		ctx.fillText(result, 0+25+(200+50)+100+(185+50)+100+(100)+20, 0+25+132/2+(30/2)+100+20);
		ctx.fillText("Result", 0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100-4);

		//	Product rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100+(100+75), 0+25+132/2+(30/2)+100, 75, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100+(100+75), 0+25+132/2+(30/2)+100, 100, 30);
		ctx.stroke();
		ctx.fillText(product, 0+25+(200+50)+100+(185+50)+100+(100+75)+20, 0+25+132/2+(30/2)+100+20);
		ctx.fillText("Product", 0+25+(200+50)+100+(185+50)+100+(100+75), 0+25+132/2+(30/2)+100-4);

		ctx.fillText("Machine T", 0+25+(200+50)+100+(185+50)+100+(100+75)/2, 0+25+132/2+(30/2)+100+3*14);
	}
}

class MachineP {
	constructor(expression, machine_d) {
		this.expression = expression;
		this.machine_d = machine_d;
	}

	async run() {
		var power_terms = [];

		await new Promise(resolve => {
			setTimeout(resolve, 1000)
		})
		this.draw(this.expression);

		// Split off the power terms into the variable and the constant integer exponent
		// Ex: 4^2 is split off into "4" and "2"
		power_terms = this.expression.split("^");
	 
		// Get the variable and constant term from the power term
		var variable_term = power_terms[0];
		console.log("This is power term 0: " + variable_term);

		var constant_term = power_terms[1];
		console.log("This is power term 1: " + constant_term);

		// Send load message with the variable term to D machine
		var d_result = await this.machine_d.load(variable_term);
		console.log("D result from var " + variable_term + " = " + d_result);

		// Use the result value to compute the exponential value and return it to the sender.
		//console.log("The result of the exponential is: " + Math.pow(d_result, constant_term));
		var pow_result = Math.pow(d_result, constant_term);
		
		await new Promise(resolve => {
			setTimeout(resolve, 1000)
		})
		this.update(this.expression, pow_result);
		
		return pow_result;
	}

	draw(pow_expr) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line(s)
		ctx.moveTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2)+100+(30));
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2)+100+(30)+100);
		ctx.stroke();

		ctx.moveTo(0+25+(200+50)+100+(75*3), 0+25+(132/2)+(30)+100);
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100, 0+25+(132/2)+(30)+100+30+100);
		ctx.stroke();
		
		//	Power Expression rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(pow_expr, 0+25+(200+50)+100+(185+50)+100+20, 0+25+132/2+(30/2)+100+(30)+100+20);
		ctx.fillText("Power", 0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100+(30)+100-4);
		
		//	Result rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.stroke();
		ctx.fillText("Result", 0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100+(30)+100-4);

		ctx.fillText("Machine P", 0+25+(200+50)+100+(185+50)+100+(100+100)/3, 0+25+132/2+(30/2)+100+(30)+100+3*14);
	}

	update(pow_expr, result) {
		var machines_canvas = document.getElementById("machines_canvas");
		var ctx = machines_canvas.getContext("2d");

		//	Draw connection line(s)
		ctx.moveTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2)+100+(30));
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100+(100/2), 0+25+(132/2)+(30/2)+100+(30)+100);
		ctx.stroke();

		ctx.moveTo(0+25+(200+50)+100+(75*3), 0+25+(132/2)+(30)+100);
		ctx.lineTo(0+25+(200+50)+100+(185+50)+100, 0+25+(132/2)+(30)+100+30+100);
		ctx.stroke();
		
		//	Power Expression rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.stroke();
		ctx.font = "14px Arial";
		ctx.fillText(pow_expr, 0+25+(200+50)+100+(185+50)+100+20, 0+25+132/2+(30/2)+100+(30)+100+20);
		ctx.fillText("Power", 0+25+(200+50)+100+(185+50)+100, 0+25+132/2+(30/2)+100+(30)+100-4);
		
		//	Result rectangle
		ctx.clearRect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.rect(0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100+(30)+100, 100, 30);
		ctx.stroke();
		ctx.fillText(result, 0+25+(200+50)+100+(185+50)+100+(100)+20, 0+25+132/2+(30/2)+100+(30)+100+20);
		ctx.fillText("Result", 0+25+(200+50)+100+(185+50)+100+(100), 0+25+132/2+(30/2)+100+(30)+100-4);

		ctx.fillText("Machine P", 0+25+(200+50)+100+(185+50)+100+(100+100)/3, 0+25+132/2+(30/2)+100+(30)+100+3*14);
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

	resolveAfter2Seconds() {
		return new Promise()
	}
}
*/