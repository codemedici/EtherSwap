import {tokens, EVM_REVERT, ETHER_ADDRESS} from './helpers'

const SimpleCrowdsale = artifacts.require('./SimpleCrowdsale')
const CrowdsaleToken = artifacts.require('./CrowdsaleToken')

require('chai')
	.use(require('chai-as-promised'))
	.should()



contract('SimpleCrowdsale', ([deployer, feeAccount, user1, user2]) => {
	
	// const initialSupply = tokens(1000)

	const startTime = Date.now()
	// console.log(startTime)
	// console.log(new Date(startTime))

	const endTime = (Date.now() + 60 * 10000) // 10 min

	const weiTokenPrice = tokens(1) // get 1 token for every Ether
	const weiInvestmentObjective = tokens(10) //.toString()

	let simpleCrowdsale
	let crowdsaleToken
	let crowdsaleTokenAddress

	beforeEach(async () => {
		simpleCrowdsale = await SimpleCrowdsale.new(startTime,endTime,weiTokenPrice,weiInvestmentObjective)
		crowdsaleTokenAddress = await simpleCrowdsale.crowdsaleToken()//{from: deployer})
		// use the instance of CrowdsaleToken contract created (i.e. pubished on the blockchain) by SimpleCrowdsale
		crowdsaleToken = await CrowdsaleToken.at(crowdsaleTokenAddress)
	})

	describe('deployment', () => {

  		it('deploys CrowdsaleToken', async () =>{
  			const result = await crowdsaleToken.address
  			console.log(result)
  			result.toString().should.equal(crowdsaleTokenAddress)
  		})

		it('tracks the startTime', async ()=>{
			const result = await simpleCrowdsale.startTime()
			console.log(new Date(startTime))
			result.toString().should.equal(startTime.toString()	)
		})

		it('tracks the endTime', async ()=>{
			const result = await simpleCrowdsale.endTime()
			console.log(new Date(endTime))
			result.toString().should.equal(endTime.toString()	)
		})

		it('tracks the weiTokenPrice', async ()=>{
			const result = await simpleCrowdsale.weiTokenPrice()
			console.log(weiTokenPrice.toString())
			result.toString().should.equal(weiTokenPrice.toString())
		})

		it('tracks the weiInvestmentObjective', async ()=>{
			const result = await simpleCrowdsale.weiInvestmentObjective()
			console.log(weiInvestmentObjective.toString())
			result.toString().should.equal(weiInvestmentObjective.toString())
		})

		// it('tracks the total supply', async ()=>{
		// 	const result = await simpleCrowdsale.totalSupply()
		// 	result.toString().should.equal(totalSupply.toString())
		// })

		// it('assigns to total supply to the deployer', async ()=>{
		// 	const result = await token.balanceOf(deployer)
		// 	result.toString().should.equal(totalSupply.toString())
		// })
	})

	describe('Investing into the crowdsale', () => {
		let amount
		let result

		describe('success', async () => {
			beforeEach(async () => {
				amount = tokens(1).toString()
				result = await simpleCrowdsale.invest({from: user1, value: amount})
			})

			it('assigns tokens to investors', async () => {
				let balanceOf
				balanceOf = await simpleCrowdsale.balanceOf(user1)
				balanceOf.toString().should.equal(tokens(1).toString())
			})

			it('increments the investmentReceived variable', async () => {
				let investmentReceived
				investmentReceived = await simpleCrowdsale.investmentReceived()
				console.log(investmentReceived)
				investmentReceived.toString().should.equal(amount)
			})

			it('mints the tokens', async () => {
				// let deployerBalance = await crowdsaleToken.balanceOf(deployer)
				// deployerBalance.toString().should.equal('1')

				// await simpleCrowdsale.invest({from: user1, value: amount})
				let user1Balance = await crowdsaleToken.balanceOf(user1)
				user1Balance.toString().should.equal('1')
			})

		})

		describe('failure', async () => {
			beforeEach(async () => {
				amount = tokens(1).toString()
				result = await simpleCrowdsale.invest({from: deployer, value: amount})
			})
			it('checks that tokens are still locked', async () => {
				// checks that users are not allowed to transfer tokens yet
				await crowdsaleToken.transfer(user1, 1, {from: deployer}).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('Finalizing the crowdsale', () => {
		let amount

		describe('success', async () => {
			beforeEach(async () => {
				amount = tokens(5).toString()
				// this meets weiInvestmentObjective of tokens(10)
				await simpleCrowdsale.invest({from: user1, value: amount})
				await simpleCrowdsale.invest({from: user2, value: amount})
			})

			it('Finalizes a successful crowdsale', async () => {
				await simpleCrowdsale.finalize()//{from: deployer})
				let released = await crowdsaleToken.released()	
				released.should.equal(true)
			})

		})

		describe('failure', async () => {
			beforeEach(async () => {
				amount = tokens(3).toString()
				// this meets weiInvestmentObjective of tokens(10)
				await simpleCrowdsale.invest({from: user1, value: amount})
				await simpleCrowdsale.invest({from: user2, value: amount})
				await simpleCrowdsale.finalize()//{from: deployer})
			})
			it('Finalizes an unsuccessful crowdsale', async () => {
				let released = await crowdsaleToken.released()
				released.should.equal(false)
				// checks that users are not allowed to transfer tokens
				await crowdsaleToken.transfer(user1, 1, {from: user2}).should.be.rejectedWith(EVM_REVERT)
			})

			it('Gets a refund', async () => {
				let isRefundingAllowed = await simpleCrowdsale.isRefundingAllowed()
				isRefundingAllowed.should.equal(true)

				// The easy way to check if ether was refunded is to ckeck the amount refunded in the Refund() event
				// comparing user's Ether balances before and after refund() is complicated as the refund() does not refund gas costs
				
			})
		})
	})

})

