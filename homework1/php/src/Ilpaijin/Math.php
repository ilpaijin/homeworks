<?php

namespace Ilpaijin;

/**
* Math class
*
* @package default
* @author ilpaijin <ilpaijin@gmail.com>
*/
class Math 
{
	/**
	 * [$a1 description]
	 * @var [type]
	 */
	public $a;

	/**
	 * [$a2 description]
	 * @var [type]
	 */
	public $b;

	/**
	 * [$response description]
	 * @var [type]
	 */
	public $response;

	/**
	 * [__construct description]
	 * @param array $a1 [description]
	 * @param array $a2 [description]
	 */
	public function __construct(array $a, array $b)
	{
		$this->a = $a;
		$this->b = $b;
	}

	/**
	 * [setDifference description]
	 */
	public function setDifference()
	{
		$aValues = array_values($this->a)[0]; // usage of array_* here only for formatting purpose, not logic involved
		$bValues = array_values($this->b)[0]; // usage of array_* here only for formatting purpose, not logic involved

		for ($i=0, $len = count($aValues); $i < $len; $i++)
		{
			if ($unique = $this->contains($aValues[$i], $bValues))
			{
				$this->response .= $unique;
			}
		}

		return $this->formatResponse();
	}

	/**
	 * [contains description]
	 * @param  [type] $needle   [description]
	 * @param  [type] $haystack [description]
	 * @return [type]           [description]
	 */
	private function contains($needle, $haystack)
	{
		foreach($haystack as $key => $value)
		{
			if($needle === $value)
			{
				return false;
			}
		}

		return $needle . ' ';
	}

	/**
	 * [FunctionName description]
	 * @param string $value [description]
	 */
	private function formatResponse()
	{
		return "{".key($this->a)." - ".key($this->b)."} = " . $this->response;
	}
}