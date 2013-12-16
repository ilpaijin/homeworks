((window, me) ->
	"use strict"

	self = window[me] || (window[me] = {})

	setDiff = (f,l) ->

		result = ''

		l.contains = (el) ->
			for x in this
				if x == el
					return true;
			return false;

		for i in f
			if !l.contains i
				result += i+" ";
		return result;

	window[me].setDifference = setDiff;

)(this,"ilpaijin")

a  = [1,2,3,8,9];
b  = [2,5,9,10,12,14];
c = ["Boys", "Girls", "Zend", "Barcelona", "Come 'on"];
d = ["Jurgen", "Berlusconi", "Paté di pato", "Frio", "Boys", "Zend"];

pre = document.getElementById("coffeeresponse");
pre.appendChild(document.createTextNode("{A - B} = " + ilpaijin.setDifference(a,b)));
pre.appendChild(document.createElement("br"));
pre.appendChild(document.createTextNode("{B - A} = " + ilpaijin.setDifference(b,a)));
pre.appendChild(document.createElement("br"));
pre.appendChild(document.createTextNode("{C - D} = " + ilpaijin.setDifference(c,d)));
pre.appendChild(document.createElement("br"));
pre.appendChild(document.createTextNode("{D - C} = " + ilpaijin.setDifference(d,c)));