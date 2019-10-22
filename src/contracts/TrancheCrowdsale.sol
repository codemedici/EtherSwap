pragma solidity ^0.5.0;

import "./SimpleCrowdsale.sol";


contract TranchePricingCrowdsale is SimpleCrowdsale  {

   	struct Tranche {
    	uint256 weiHighLimit;
     	uint256 weiTokenPrice;
   	}
    
   mapping(uint256 => Tranche) public trancheStructure;
   uint256 public currentTrancheLevel; // tranch level with respect to investment so far

   constructor  (
   				uint256 _startTime,
   				uint256 _endTime, 
      			uint256 _etherInvestmentObjective
      			) 
      			SimpleCrowdsale (_startTime, _endTime, 1, _etherInvestmentObjective) // calling constructor on base contract
   				payable public
			   	{

					// TODO hardcoded for simplicity, allow feeding these parameters to constructor
				    trancheStructure[0] = Tranche(3000 ether, 0.002 ether);
				    trancheStructure[1] = Tranche(10000 ether, 0.003 ether);
				    trancheStructure[2] = Tranche(15000 ether, 0.004 ether);
				    trancheStructure[3] = Tranche(1000000000 ether, 0.005 ether);
				        
				    currentTrancheLevel = 0;
			    } 
  
  	// overrides original calculateNumberOfTokens()
    function calculateNumberOfTokens(uint256 investment) internal returns (uint256) {
      	updateCurrentTrancheAndPrice();
      	return investment / weiTokenPrice; 
    }

    function updateCurrentTrancheAndPrice() internal {
    	uint256 i = currentTrancheLevel;
      
      	// tests to identify where investment falls
    	while(trancheStructure[i].weiHighLimit < investmentReceived) 
        	++i;
          
   		currentTrancheLevel = i;
   		// updates token's weiTokenPrice according to currentTrancheLevel
    	weiTokenPrice = trancheStructure[currentTrancheLevel].weiTokenPrice;
    }
}

