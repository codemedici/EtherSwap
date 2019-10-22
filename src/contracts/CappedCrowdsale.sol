pragma solidity ^0.5.0;
import "./SimpleCrowdsale.sol";

contract CappedCrowdsale is SimpleCrowdsale {
    uint256 fundingCap;

    constructor (uint256 _startTime, uint256 _endTime, uint256 _weiTokenPrice, uint256 _etherInvestmentObjective, uint256 _fundingCap)
    SimpleCrowdsale(_startTime, _endTime, _weiTokenPrice, _etherInvestmentObjective)
    payable public
    {
        require(_fundingCap > 0);
        fundingCap = _fundingCap;
    }
     
    function isFullInvestmentWithinLimit(uint256 _investment) 
        internal view returns (bool) {
        bool check = investmentReceived + _investment < fundingCap;
        return check;
    }
}

