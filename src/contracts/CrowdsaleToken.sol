pragma solidity ^0.5.0;
import "./Token.sol";
contract CrowdsaleToken is Token {
    bool public released = false;

    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() onlyOwner whenNotPaused public {
        paused = true;
    }

    function unpause() onlyOwner whenPaused public {
        paused = false;
    }

    modifier isReleased() {
        if(!released) {
            revert();
        }
        _;
    }

    // TODO add uint256 _initialSupply to Token's constructor, remember to change the tests accordingly
    constructor() Token() public {}

    function release() onlyOwner public {
        released = true;
    }

    function transfer(address _to, uint256 _amount) isReleased whenNotPaused public returns (bool) {
        super.transfer(_to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) isReleased whenNotPaused public returns (bool) {
        super.transferFrom(_from, _to, _amount);
    }

    
}

