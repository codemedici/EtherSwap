pragma solidity ^0.5.0;

import "./CrowdsaleToken.sol";

contract SimpleCrowdsale {
    uint256 public startTime; // start time in UNIX epoch
    uint256 public endTime; // end time in UNIX epoch
    uint256 public weiTokenPrice;
    uint256 public weiInvestmentObjective;

    address public owner;
       
    mapping (address => uint256) public balanceOf; // amount of Ether received by each investor
    uint256 public investmentReceived;
    uint256 public investmentRefunded;
    
    bool public isFinalized;
    bool public isRefundingAllowed; 

    CrowdsaleToken public crowdsaleToken; // instance of the contract of the token being sold
    
    constructor(uint256 _startTime, uint256 _endTime, uint256 _weiTokenPrice, uint256 _weiInvestmentObjective) public
    {
        require(_startTime >= now);
        require(_endTime >= _startTime);
        require(_weiTokenPrice != 0);
        require(_weiInvestmentObjective != 0);

        owner = msg.sender;
        
        startTime = _startTime;
        endTime = _endTime;

        weiTokenPrice = _weiTokenPrice;
        weiInvestmentObjective = _weiInvestmentObjective;
    
    	// TODO add _initialSupply ammount to CrowdsaleToken's constructor, atm an arbitrary amount is minted in Token.sol
        crowdsaleToken = new CrowdsaleToken(); // instantiates the contract of the token being sold in the crowdsale, minting 0 tokens
        isFinalized = false;
    }
    
    event LogInvestment(address indexed investor, uint256 value);
    event LogTokenAssignment(address indexed investor, uint256 numTokens);
    event Refund(address investor, uint256 value);
    
    function invest() public payable {
        // require(isValidInvestment(msg.value));  // checks if valid
        
        address investor = msg.sender;
        uint256 investment = msg.value;
        
        balanceOf[investor] += investment; 
        investmentReceived += investment;
        
        assignTokens(investor, investment); // converts Ethers into crowdsale tokens
        emit LogInvestment(investor, investment);      
    }

    function isValidInvestment(uint256 _investment) internal view returns (bool) {
        bool nonZeroInvestment = _investment != 0; // False if 0
        bool withinCrowdsalePeriod = now >= startTime && now <= endTime;  // False if outside crowdsale period
        
        return nonZeroInvestment && withinCrowdsalePeriod; // return true if checks passed
    }
    
    function assignTokens(address _beneficiary, uint256 _investment) internal {
    
        uint256 _numberOfTokens = calculateNumberOfTokens(_investment); 
        
        crowdsaleToken.mint(_beneficiary, _numberOfTokens);
    }
    
    function calculateNumberOfTokens(uint256 _investment) internal returns (uint256) {
        return _investment / weiTokenPrice; 
    }
    
    function finalize() public {
    	require (!isFinalized);
    	require (msg.sender == owner);
    
        bool isCrowdsaleComplete = true;//now > endTime; 
        bool investmentObjectiveMet = investmentReceived >= weiInvestmentObjective;
            
        if (isCrowdsaleComplete)
        {     
            if (investmentObjectiveMet)

                crowdsaleToken.release();
            else 
                isRefundingAllowed = true;
    
            isFinalized = true;
        }               
    }
    
    function refund() public {
        if (!isRefundingAllowed) revert();
    
        address payable investor = msg.sender;
        uint256 investment = balanceOf[investor];
        if (investment == 0) revert();
        balanceOf[investor] = 0;
        investmentRefunded += investment;
        emit Refund(msg.sender, investment);
        // equivalent to
        // if( !investor.transfer(investment) ) revert();
        investor.transfer(investment);
    }
}

