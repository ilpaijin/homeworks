(function(window, me)
{
	'use strict';

	var self = window[me] || (window[me] = {});

	var setDiff = function(f,l)
	{
		var result='';

		// if (!Array.prototype.contains) { Array.prototype.contains = function(el)
			l.contains = function(el)
			{
				for(var x in this)
				{
					if(this.hasOwnProperty(x) && this[x] == el)
					{
						return true;
					}
				}

				return false;
			}
		// }	

		for(var i = 0, len = f.length; i < len; i++)
		{
			if (!l.contains(f[i]))
			{
				result += f[i]+' ';
			}
		}

		return result;
	}

	window[me].setDifference = setDiff;

})(this,'ilpaijin');

var a  = [1,2,3,8,9];
var b  = [2,5,9,10,12,14];
var c = ["Boys", "Girls", "Zend", "Barcelona", "Come 'on"];
var d = ["Jurgen", "Berlusconi", "Paté di pato", "Frio", "Boys", "Zend"];

var pre = document.getElementById('jsresponse');
pre.appendChild(document.createTextNode('{A - B} = ' + ilpaijin.setDifference(a,b)));
pre.appendChild(document.createElement('br'));
pre.appendChild(document.createTextNode('{B - A} = ' + ilpaijin.setDifference(b,a)));
pre.appendChild(document.createElement('br'));
pre.appendChild(document.createTextNode('{C - D} = ' + ilpaijin.setDifference(c,d)));
pre.appendChild(document.createElement('br'));
pre.appendChild(document.createTextNode('{D - C} = ' + ilpaijin.setDifference(d,c)));