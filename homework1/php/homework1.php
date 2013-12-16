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

$a = array('A' => array(1,2,3,8,9));
$b = array('B' => array(2,5,9,10,12,14));
$c = array('C' => array("Boys", "Girls", "Zend", "Barcelona", "Come 'on"));
$d = array('D' => array("Jurgen", "Berlusconi", "Paté di pato", "Frio", "Boys", "Zend"));

$ab = new Math($a, $b);
$abDiff = $ab->setDifference();

$ba = new Math($b, $a);
$baDiff = $ba->setDifference();

$cd = new Math($c, $d);
$cdDiff = $cd->setDifference();

$dc = new Math($d, $c);
$dcDiff = $dc->setDifference();

echo $result = json_encode(array($abDiff, $baDiff, $cdDiff, $dcDiff));

