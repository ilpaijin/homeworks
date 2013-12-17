(function(global, me)
{
	'use strict';

	var self = global[me] || (global[me] = {});

	var setDiff = function(f,l)
	{
		var result=[],
			i = 0,
			j = 0;

		l.contains = function(i)
		{
			for(var x in this)
			{
				if(this.hasOwnProperty(x) && this[x] > i)
				{
					return false;
				}

				if(this.hasOwnProperty(x) && this[x] == i)
				{
					return true;
				}
			}

			return false;
		}	

		for(var i = 0, len = f.length; i < len; i++)
		{
			if (!l.contains(f[i]))
			{
				result += f[i]+' ';
			}
		}

		console.info(result);

		return result;
	}

	self.setDifference = setDiff;

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