pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/IERC20.sol';
import 'openzeppelin-solidity/contracts/GSN/Context.sol';

contract Token is Context, IERC20{
	using SafeMath for uint;

	string public name = 'DApp Token'; // optional
	string public symbol = 'DAPP'; // optional
	uint256 public decimals = 18; // optional
	uint256 public totalSupply;

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;

	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);

	constructor() public {
		totalSupply = 1000000 * (10 ** decimals);
		balanceOf[msg.sender] = totalSupply;
		emit Transfer(address(0), msg.sender, totalSupply);
	}


	function transfer(address to, uint256 value) public returns (bool success) {
		require(balanceOf[msg.sender] >= value);
		_transfer(_msgSender(), to, value);
		return true;
	}

	function _transfer(address from, address to, uint256 value) internal {
		require(to != address(0), "ERC20: transfer to the zero address");
		require(from != address(0), "ERC20: transfer from the zero address");
		balanceOf[from] = balanceOf[from].sub(value);
		balanceOf[to] = balanceOf[to].add(value);
		emit Transfer(from, to, value);
	}

	function approve(address spender, uint256 value) public returns (bool success) {
		require(spender != address(0));
		// TODO require that msg.sender can't approve funds they don't have
		allowance[msg.sender][spender] = value; // if called again overwrites allowance
		emit Approval(msg.sender, spender, value);
		return true;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
		// this checks both that user allowance is enough and that user is allowed
		require(_value <= allowance[_from][msg.sender]);
		// in case I allowed myself (or someone allowed me) to spend more than they have
		require(balanceOf[_from] >= _value);
		// TODO check sending to and from the same msg.sender are not allowed,
		// otherwise someone could fill their own orders on the exchange
		allowance[_from][_msgSender()] = allowance[_from][_msgSender()].sub(_value);
		_transfer(_from, _to, _value);
		return true;
	}

}
