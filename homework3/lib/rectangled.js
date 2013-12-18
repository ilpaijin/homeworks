/*!
 *  rectangled v0.0.1
 *
 *  (c) 2013, ilpaijin@gmail.com
 *
 *  MIT License
 */

(function(global)
{
	'use strict';

	/**
	 * [jin description]
	 * @type {Object}
	 */
	var jin = {},
		helpers = {
			randomize: function(min, max)
			{
				return Math.floor(Math.random() * (max-min) + min);
			},
			backgRandom: function()
			{
				var hex = "123456789ABCDEF",
					color = '#';

				for(var i=0; i < 6; i++)
				{
					var rnd = helpers.randomize(0, hex.length);
					color += hex[rnd];
				}
				return color;
			}
		};

	/**
	 * [generate description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	var generate = function(options)
	{
		jin.settings = options; 
		jin.hoverTimeOut = 0;
		jin.maxZIndex = 0;
	};	

	/**
	 * [createContainer description]
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	var createContainer = function(x, y)
	{
		var div = document.createElement('div');
		div.setAttribute('id', 'container');
		div.style.background = helpers.backgRandom();
		div.style.width = jin.settings.containerWidth + 'px';
		div.style.height = jin.settings.containerHeight + 'px';
		div.style.position = "absolute";
		div.style.left = (x || 0) + 'px';
		div.style.top = (y || 0) + 'px';
		document.body.appendChild(div);
	};

	/**
	 * [createShapes description]
	 * @return {[type]} [description]
	 */
	var createShapes = function()
	{
		for(var i = 0; i < jin.settings.nRectangles; i++)
		{
			var div = document.createElement('div');
			var width = helpers.randomize(jin.settings.minRectDim, jin.settings.maxRectDim);
			var height = helpers.randomize(jin.settings.minRectDim, jin.settings.maxRectDim);
			div.setAttribute('class', 'nRectangles');
			div.setAttribute('id', 'nRectangles'+0);
			div.style.background = helpers.backgRandom();
			div.style.width = width + 'px';
			div.style.height = height + 'px';
			div.style.position = "absolute";
			div.style.left = helpers.randomize(0, (jin.settings.containerWidth - width)) + 'px';
			div.style.top = helpers.randomize(0, (jin.settings.containerHeight - height)) + 'px';
			div.style.zIndex = i;
			document.getElementById('container').appendChild(div);

			jin.maxZIndex = i;

			staticListeners.mouseenter(div);
			staticListeners.mouseleave(div);
		}
	};

	/**
	 * [staticListener description]
	 * @type {Object}
	 */
	var staticListeners = 
	{
		mouseenter: function(el)
		{
			return el.addEventListener("mouseenter", function(ev)
			{
				el.style.background = helpers.backgRandom();

				el.hoverTimeOut = setTimeout(function()
				{
					//As alternative implement algorithm Ax < x < Bx && Ay < y < Cy
					el.style.left = helpers.randomize(0, (jin.settings.containerWidth - el.clientWidth)) + 'px';
					el.style.top = helpers.randomize(0, (jin.settings.containerHeight - el.clientHeight)) + 'px';

					var hoveredEl = document.elementFromPoint(ev.pageX, ev.pageY);
					if (hoveredEl.id === el.id)
					{
						el.style.left = helpers.randomize(0, (jin.settings.containerWidth - el.clientWidth)) + 'px';
						el.style.top = helpers.randomize(0, (jin.settings.containerHeight - el.clientHeight)) + 'px';
					};

					el.style.zIndex = jin.maxZIndex++;

				},3000);
			});
		},
		mouseleave : function(el)
		{
			return el.addEventListener("mouseleave", function()
			{
				clearTimeout(el.hoverTimeOut);
			});
		}
	}

	/* exposing global methods */
	global.jin = {
		generate: generate,
		createShapes : createShapes,
		createContainer: createContainer 
	};

})(this);