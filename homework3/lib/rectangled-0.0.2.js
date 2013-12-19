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
			},
			extend: function(dest, target)
			{
				for(var p in target)
				{
					dest[p] = target[p];
				}
				return dest;
			}
		},
		attributesMap = { 
			"#": "id", 
			".": "class"
		};
	
	/**
	 * [Shape Constructor]
	 * @param {[type]} options [description]
	 */
 	var Shape = function(options)
 	{
 		this.options = {
 			el: "div",
 			unique: Math.random()
 		};	

		helpers.extend(this.options, options);

		this.el = document.createElement(this.options.el);

		var width = helpers.randomize(jin.settings.minRectDim, jin.settings.maxRectDim);
		var height = helpers.randomize(jin.settings.minRectDim, jin.settings.maxRectDim);

		this.el.setAttribute('class', 'nRectangles');
		this.el.setAttribute('id', 'nRectangles'+this.options.unique);
		this.el.style.background = helpers.backgRandom();
		this.el.style.width = width + 'px';
		this.el.style.height = height + 'px';
		this.el.style.position = "absolute";
		this.el.style.left = helpers.randomize(0, (jin.settings.containerWidth - width)) + 'px';
		this.el.style.top = helpers.randomize(0, (jin.settings.containerHeight - height)) + 'px';
		this.el.style.zIndex = this.options.unique;

		jin.maxZIndex = this.options.unique;

		staticListeners.mouseenter(this.el);
		staticListeners.mouseleave(this.el);
 	};


	/**
	 * [generate description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	var generate = function(options)
	{
		if(options.container)
		{
			var m = options.container.match(/#|\./);

			if(m)
			{
				var e = options.container.split(m[0]);
				options.container = {
					el: e[0],
					attr: attributesMap[m[0]],
					value: e[1]
				}
			}
		} else 
		{
			options.container = {
				el: "div",
				attr: "id",
				value: "container"
			}	
		}

		jin.settings = options; 
		jin.hoverTimeOut = 0;
		jin.maxZIndex = 0;

		createContainer();
		createShapes();
	};	

	/**
	 * [createContainer description]
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	var createContainer = function(x, y)
	{
		var div = document.createElement(jin.settings.container.el);
		div.setAttribute(jin.settings.container.attr, jin.settings.container.value);
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
		var fragment = document.createDocumentFragment();
		
		for(var i = 0; i < jin.settings.nRectangles; i++)
		{
			var s = new Shape({
				el: 'p', 
				unique: i
			});

			fragment.appendChild(s.el);
		}

		for(var attr in attributesMap)
		{
			if (attributesMap[attr] == jin.settings.container.attr)
			{
				var sign = attr;
			}
		}

		document.querySelectorAll(sign + jin.settings.container.value)[0].appendChild(fragment);
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

				},10);
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
		generate: generate
	};

})(this);